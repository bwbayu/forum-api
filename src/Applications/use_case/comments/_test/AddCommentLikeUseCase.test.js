/* eslint-disable no-undef */
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddCommentLikeUseCase = require('../AddCommentLikeUseCase');

describe('AddCommentLikeUseCase', () => {
  it('should throw an error if payload is not valid', async () => {
    const useCasePayload = {
      comment_id: 'comment-123',
      thread_id: 'thread-123',
    };

    const addCommentLikeUseCase = new AddCommentLikeUseCase({});

    await expect(addCommentLikeUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw an error if payload data types are incorrect', async () => {
    const useCasePayload = {
      comment_id: 123,
      thread_id: 'thread-123',
      owner: 'user-123',
    };

    const addCommentLikeUseCase = new AddCommentLikeUseCase({});

    await expect(addCommentLikeUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add comment like action correctly', async () => {
    const useCasePayload = {
      comment_id: 'comment-123',
      thread_id: 'thread-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.toggleCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addCommentLikeUseCase = new AddCommentLikeUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await addCommentLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.toggleCommentLike).toHaveBeenCalledWith('comment-123', 'user-123');
  });
});
