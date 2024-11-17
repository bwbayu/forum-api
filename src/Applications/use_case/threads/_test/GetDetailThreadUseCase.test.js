const DetailComment = require("../../../../Domains/comments/entities/DetailComment");
const DetailThread = require("../../../../Domains/threads/entities/DetailThread");
const GetDetailThreadUseCase = require("../GetDetailThreadUseCase");

describe('GetDetailThreadUseCase', () => {
    const useCasePayload = 'thread-123';
    const mockThreadData = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2024-11-16T00:00:00.000Z',
        username: 'user123',
    };
    const mockCommentData = [
        {
            id: 'comment-123',
            content: 'Comment Content',
            date: '2024-11-16T00:00:00.000Z',
            username: 'user1',
        },
        {
            id: 'comment-124',
            content: 'Comment Content 2',
            date: '2024-11-16T00:00:00.000Z',
            username: 'user2',
        },
    ];

    it('should orchestrate the get detail thread action correctly', async () => {
        // Arrange
        const mockThreadRepository = {
            getThreadById: jest.fn(() => Promise.resolve(mockThreadData)),
        };
        const mockCommentRepository = {
            getCommentByThreadId: jest.fn(() => Promise.resolve(mockCommentData)),
        };

        const getDetailThreadUseCase = new GetDetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Act
        const result = await getDetailThreadUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload);
        expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(useCasePayload);
        expect(result).toStrictEqual({
            "thread" : new DetailThread({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                date: '2024-11-16T00:00:00.000Z',
                username: 'user123',
                comments: [
                    new DetailComment({
                        id: 'comment-123',
                        content: 'Comment Content',
                        date: '2024-11-16T00:00:00.000Z',
                        username: 'user1',
                    }),
                    new DetailComment({
                        id: 'comment-124',
                        content: 'Comment Content 2',
                        date: '2024-11-16T00:00:00.000Z',
                        username: 'user2',
                    }),
                ],
            }), 
        });
    });

    it('should orchestrate the get detail thread action correctly when there is no comment', async () => {
        // Arrange
        const mockThreadRepository = {
            getThreadById: jest.fn(() => Promise.resolve(mockThreadData)),
        };
        const mockCommentRepository = {
            getCommentByThreadId: jest.fn(() => Promise.resolve([])),
        };

        const getDetailThreadUseCase = new GetDetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Act
        const result = await getDetailThreadUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload);
        expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(useCasePayload);
        expect(result).toStrictEqual({
            "thread" : new DetailThread({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                date: '2024-11-16T00:00:00.000Z',
                username: 'user123',
                comments: [],
            }), 
        });
    });
});
