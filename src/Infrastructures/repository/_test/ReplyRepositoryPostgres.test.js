const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
/* eslint-disable no-undef */
describe('ReplyRepositoryPostgres', () => {
  const user_id = 'user-123';
  const thread_id = 'thread-123';
  const comment_id = 'comment-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: user_id });
    await ThreadsTableTestHelper.addThread({ id: thread_id, user_id });
    await CommentsTableTestHelper.addComment({ id: comment_id, user_id, thread_id });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist reply comment and return added reply comment correctly', async () => {
      const reply = new NewReply({
        content: 'This is a reply comment',
        user_id,
        thread_id,
        comment_id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(reply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'This is a reply comment',
        user_id: 'user-123',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should mark reply as deleted', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', thread_id, user_id, comment_id,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply('reply-123');

      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
      expect(reply[0].is_delete).toEqual(true);
      expect(reply[0].content).toEqual('**balasan telah dihapus**');
    });

    it('should throw NotFoundError when deleting a non-existent reply', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.deleteReply('reply-789')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getReplyByCommentId function', () => {
    it('should return replies by comment id', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', thread_id, user_id, comment_id, content: 'This is a reply comment',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-124', thread_id, user_id, comment_id, content: 'This is a reply comment 2',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getReplyByCommentId(comment_id);

      expect(replies).toHaveLength(2);
    });

    it('should return empty array if no replies found for comment', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getReplyByCommentId('comment-789');

      expect(replies).toEqual([]);
    });
  });

  describe('getReplyById function', () => {
    it('should return the reply details when id is found', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', thread_id, user_id, comment_id, content: 'This is a reply comment',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getReplyById('reply-123');

      expect(replies.id).toEqual('reply-123');
      expect(replies.content).toEqual('This is a reply comment');
    });

    it('should throw NotFoundError if reply id is not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.getReplyById('reply-999'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should not throw any error if user is the owner of the reply', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', thread_id, user_id, comment_id,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', user_id))
        .resolves
        .not.toThrow();
    });

    it('should throw AuthorizationError when user is not the owner of the reply', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', thread_id, user_id, comment_id,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-999'))
        .rejects
        .toThrowError(AuthorizationError);
    });
  });
});
