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
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
/* eslint-disable no-undef */
describe('ReplyRepositoryPostgres', () => {
  const owner = 'user-123';
  const threadPayload = {
    id: 'thread-123',
    owner,
    title: 'thread 1',
    body: 'isi thread 1',
    created_at: new Date().toISOString(),
  }

  const commentPayload = {
    id: 'comment-123',
    thread_id: threadPayload.id,
    owner,
    content: 'This is a comment',
    created_at: new Date().toISOString(),
    is_delete: false,
  }

  const replyPayload1 = {
    id: 'reply-123',
    thread_id: threadPayload.id,
    owner,
    comment_id: commentPayload.id,
    content: 'This is a reply comment',
    created_at: new Date().toISOString(),
    is_delete: false,
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
    await ThreadsTableTestHelper.addThread(threadPayload);
    await CommentsTableTestHelper.addComment(commentPayload);
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
        owner,
        thread_id: threadPayload.id,
        comment_id: commentPayload.id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(reply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'This is a reply comment',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should mark reply as deleted', async () => {
      await RepliesTableTestHelper.addReply(replyPayload1);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply('reply-123');

      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      const expectedReply = {
        ...replyPayload1,
        created_at: reply[0].created_at,
        is_delete: true,
      };
      expect(reply).toHaveLength(1);
      expect(reply[0]).toStrictEqual(expectedReply);
    });

    it('should throw NotFoundError when deleting a non-existent reply', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.deleteReply('reply-789')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getReplyByCommentId function', () => {
    it('should return replies by comment id', async () => {
      await RepliesTableTestHelper.addReply(replyPayload1);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getReplyByCommentId(commentPayload.id);

      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual(new DetailReply({
        id: 'reply-123',
        content: 'This is a reply comment',
        is_delete: false,
        date: replies[0].date,
        username: 'dicoding',
      }));
    });

    it('should return empty array if no replies found for comment', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getReplyByCommentId('comment-789');

      expect(replies).toEqual([]);
    });
  });

  describe('getReplyById function', () => {
    it('should return the reply details when id is found', async () => {
      await RepliesTableTestHelper.addReply(replyPayload1);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const reply = await replyRepositoryPostgres.getReplyById('reply-123');

      const expectedReply = {
        ...replyPayload1,
        created_at: reply.created_at,
      };
      expect(reply).toStrictEqual(expectedReply);
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
      await RepliesTableTestHelper.addReply(replyPayload1);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', owner))
        .resolves
        .not.toThrow(AuthorizationError);
    });

    it('should throw AuthorizationError when user is not the owner of the reply', async () => {
      await RepliesTableTestHelper.addReply(replyPayload1);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-999'))
        .rejects
        .toThrowError(AuthorizationError);
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should throw NotFoundError if no reply found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if reply found', async () => {
      await RepliesTableTestHelper.addReply(replyPayload1);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
