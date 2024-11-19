/* eslint-disable no-undef */
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw an error if payload is not valid', async () => {
    const useCasePayload = {};

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw an error if payload data types are incorrect', async () => {
    const useCasePayload = {
      comment_id: 'comment-123',
      thread_id: 'thread-123',
      user_id: 'user-123',
      reply_id: 123,
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      comment_id: 'comment-123',
      thread_id: 'thread-123',
      user_id: 'user-123',
      reply_id: 'reply-123',
    };

    // define mock repo
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // validation mock
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: useCasePayload.comment_id }));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: useCasePayload.thread_id }));
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: useCasePayload.reply_id }));
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith('comment-123');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockReplyRepository.getReplyById).toHaveBeenCalledWith('reply-123');
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith('reply-123', 'user-123');
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith('reply-123');
  });
});
