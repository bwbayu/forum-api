const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
/* eslint-disable no-undef */

describe('CommentRepositoryPostgres', () => {
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

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
    await ThreadsTableTestHelper.addThread(threadPayload);
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment and return added comment correctly', async () => {
      const comment = new NewComment({
        content: 'This is a comment',
        owner,
        thread_id: threadPayload.id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(comment);

      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'This is a comment',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should mark comment as deleted', async () => {
      await CommentsTableTestHelper.addComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment('comment-123');

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(comment[0].is_delete).toEqual(true);
      expect(comment[0].id).toEqual('comment-123');
      expect(comment[0].thread_id).toEqual('thread-123');
      expect(comment[0].owner).toEqual('user-123');
      expect(comment[0].content).toEqual('This is a comment');
      expect(comment[0].created_at).toEqual(comment[0].created_at);
    });

    it('should throw NotFoundError when deleting a non-existent comment', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.deleteComment('comment-789')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return comments by thread ID', async () => {
      await CommentsTableTestHelper.addComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      const comments = await commentRepositoryPostgres.getCommentByThreadId(threadPayload.id);

      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual(new DetailComment({
        id: 'comment-123',
        content: 'This is a comment',
        is_delete: false,
        date: comments[0].date,
        username: 'dicoding',
        replies: [],
        likeCount: 0,
      }));
    });

    it('should return empty array if no comments found for thread', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-789');

      expect(comments).toEqual([]);
    });
  });

  describe('getCommentById function', () => {
    it('should return the comment details when id is found', async () => {
      await CommentsTableTestHelper.addComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      expect(comment.id).toEqual('comment-123');
      expect(comment.thread_id).toEqual('thread-123');
      expect(comment.owner).toEqual('user-123');
      expect(comment.content).toEqual('This is a comment');
      expect(comment.is_delete).toEqual(false);
      expect(comment.created_at).toEqual(comment.created_at);
    });

    it('should throw NotFoundError if comment id is not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.getCommentById('comment-999'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should not throw any error if user is the owner of the comment', async () => {
      await CommentsTableTestHelper.addComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', owner))
        .resolves
        .not.toThrow(AuthorizationError);
    });

    it('should throw AuthorizationError when user is not the owner of the comment', async () => {
      await CommentsTableTestHelper.addComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-999'))
        .rejects
        .toThrowError(AuthorizationError);
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError if no comment found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if comment found', async () => {
      await CommentsTableTestHelper.addComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('toggleCommentLike function', () => {
    it('should like a comment if it is not liked before', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment(commentPayload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Action
      await commentRepositoryPostgres.toggleCommentLike('comment-123', owner);

      // Assert
      const likes = await CommentLikesTableTestHelper.findCommentLikes('comment-123', owner);
      
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toEqual('commentLike-123');
      expect(likes[0].owner).toEqual('user-123');
      expect(likes[0].comment_id).toEqual('comment-123');
      expect(likes[0].is_delete).toEqual(false);
    });

    it('should unlike a comment if it is already liked', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment(commentPayload);
      await CommentLikesTableTestHelper.toggleCommentLikes({
        id: 'commentLike-123',
        comment_id: 'comment-123',
        owner,
        is_delete: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Action
      await commentRepositoryPostgres.toggleCommentLike('comment-123', owner);

      // Assert
      const likes = await CommentLikesTableTestHelper.findCommentLikes('comment-123', owner);
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toEqual('commentLike-123');
      expect(likes[0].owner).toEqual('user-123');
      expect(likes[0].comment_id).toEqual('comment-123');
      expect(likes[0].is_delete).toEqual(true);
    });

    it('should like a comment again if it is previously unliked', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment(commentPayload);
      await CommentLikesTableTestHelper.toggleCommentLikes({
        id: 'commentLike-123',
        comment_id: 'comment-123',
        owner,
        is_delete: true,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Action
      await commentRepositoryPostgres.toggleCommentLike('comment-123', owner);

      // Assert
      const likes = await CommentLikesTableTestHelper.findCommentLikes('comment-123', owner);
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toEqual('commentLike-123');
      expect(likes[0].owner).toEqual('user-123');
      expect(likes[0].comment_id).toEqual('comment-123');
      expect(likes[0].is_delete).toEqual(false);
    });
  });
});
