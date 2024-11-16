const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const AddCommentUseCase = require("../AddCommentUseCase");
const AddedComment = require("../../../../Domains/comments/entities/AddedComment");

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        const useCasePayload = {
            content: 'This is a comment',
        };

        const threadPayload = 'thread-123';
        const userPayload = 'user-123';

        const mockAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            user_id: userPayload,
        });

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockUserRepository = new UserRepository();

        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({ id: threadPayload }));

        mockUserRepository.getUserById = jest.fn()
            .mockImplementation(() => Promise.resolve({ id: userPayload }));

        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment));

        const addCommentUseCase = new AddCommentUseCase({
            CommentRepository: mockCommentRepository,
            ThreadRepository: mockThreadRepository,
            UserRepository: mockUserRepository,
        });

        const addedComment = await addCommentUseCase.execute(useCasePayload, threadPayload, userPayload);

        expect(addedComment).toStrictEqual(new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            user_id: userPayload,
        }));
    });
});
