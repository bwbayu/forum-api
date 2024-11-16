const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe('DeleteCommentUseCase', () => {
    it('should throw an error if payload is not valid', async () => {
        const useCasePayload = {
            comment_id: 'comment-123',
            thread_id: 'thread-123',
        };

        const deleteCommentUseCase = new DeleteCommentUseCase({});

        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    });

    it('should throw an error if payload data types are incorrect', async () => {
        const useCasePayload = {
            comment_id: 123,
            thread_id: 'thread-123',
            user_id: 'user-123',
        };

        const deleteCommentUseCase = new DeleteCommentUseCase({});

        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the delete comment action correctly', async () => {
        const useCasePayload = {
            comment_id: 'comment-123',
            thread_id: 'thread-123',
            user_id: 'user-123',
        };

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({ id: useCasePayload.thread_id }));
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve({ id: useCasePayload.comment_id }));
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            CommentRepository: mockCommentRepository,
            ThreadRepository: mockThreadRepository
        });

        await deleteCommentUseCase.execute(useCasePayload);
        
        expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.thread_id);
        expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.comment_id);
        expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(useCasePayload.comment_id, useCasePayload.user_id);
        expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.comment_id);
    })
})