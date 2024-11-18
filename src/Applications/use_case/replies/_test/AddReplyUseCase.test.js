const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository");
const AddReplyUseCase = require("../AddReplyUseCase");
const AddedReply = require("../../../../Domains/replies/entities/AddedReply");

describe('AddReplyUseCase', () => {
    let mockReplyRepository, mockCommentRepository, mockThreadRepository, mockUserRepository, addReplyUseCase;

    const useCasePayload = {
        content: 'This is a reply comment',
        thread_id: 'thread-123',
        user_id: 'user-123',
        comment_id: 'comment-123',
    };

    const mockAddedReply = new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        user_id: useCasePayload.user_id,
    });

    beforeEach(() => {
        mockReplyRepository = new ReplyRepository();
        mockCommentRepository = new CommentRepository();
        mockThreadRepository = new ThreadRepository();
        mockUserRepository = new UserRepository();

        mockCommentRepository.getCommentById = jest.fn().mockResolvedValue({ id: useCasePayload.comment_id });
        mockThreadRepository.getThreadById = jest.fn().mockResolvedValue({ id: useCasePayload.thread_id });
        mockUserRepository.getUserById = jest.fn().mockResolvedValue({ id: useCasePayload.user_id });
        mockReplyRepository.addReply = jest.fn().mockResolvedValue(mockAddedReply);

        addReplyUseCase = new AddReplyUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            userRepository: mockUserRepository,
            replyRepository: mockReplyRepository,
        });
    });

    it('should orchestrate the add reply action correctly', async () => {
        // Act
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith('comment-123');
        expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
        expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
        expect(addedReply).toEqual(new AddedReply({
            id: 'reply-123',
            content: 'This is a reply comment',
            user_id: 'user-123',
        }));
    });
});
