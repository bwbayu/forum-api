/* eslint-disable no-undef */
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../../Domains/replies/entities/NewReply');

describe('AddReplyUseCase', () => {
  let mockReplyRepository; let mockCommentRepository; let mockThreadRepository; let
    addReplyUseCase;

  const useCasePayload = {
    content: 'This is a reply comment',
    thread_id: 'thread-123',
    owner: 'user-123',
    comment_id: 'comment-123',
  };

  const mockAddedReply = new AddedReply({
    id: 'reply-123',
    content: useCasePayload.content,
    owner: useCasePayload.owner,
  });

  beforeEach(() => {
    mockReplyRepository = new ReplyRepository();
    mockCommentRepository = new CommentRepository();
    mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockResolvedValue();
    mockReplyRepository.addReply = jest.fn().mockResolvedValue(mockAddedReply);

    addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });
  });

  it('should orchestrate the add reply action correctly', async () => {
    // Act
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new NewReply(useCasePayload));
    expect(addedReply).toEqual(new AddedReply({
      id: 'reply-123',
      content: 'This is a reply comment',
      owner: 'user-123',
    }));
  });
});
