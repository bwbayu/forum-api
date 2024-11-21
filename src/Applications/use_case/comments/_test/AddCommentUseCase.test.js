/* eslint-disable no-undef */
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../../Domains/comments/entities/NewComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'This is a comment',
      thread_id: 'thread-123',
      owner: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: useCasePayload.thread_id }));

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: useCasePayload.owner }));

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.thread_id);
    expect(mockUserRepository.getUserById).toBeCalledWith(useCasePayload.owner);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment(useCasePayload));
    expect(addedComment).toStrictEqual(mockAddedComment);
  });
});
