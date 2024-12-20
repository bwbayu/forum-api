/* eslint-disable no-undef */
const DetailComment = require('../../../../Domains/comments/entities/DetailComment');
const DetailThread = require('../../../../Domains/threads/entities/DetailThread');
const DetailReply = require('../../../../Domains/replies/entities/DetailReply');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const FullDetailThread = require('../../../../Domains/threads/entities/FullDetailThread');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrate the get detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    const mockReplies = {
      'comment-123': [
        new DetailReply({
          id: 'reply-123',
          content: 'Reply Content 1',
          date: '2023-11-18',
          username: 'bob',
          is_delete: false,
        }),
        new DetailReply({
          id: 'reply-124',
          content: 'Reply 2 content 1',
          date: '2023-11-18',
          username: 'bob 2',
          is_delete: true,
        }),
      ],
      'comment-456': [],
    };
    
    const mockComments = [
      new DetailComment({
        id: 'comment-123',
        content: 'Comment Content 1',
        date: '2023-11-18',
        username: 'jane_doe',
        replies: [],
        is_delete: false,
        likeCount: 0,
      }),
      new DetailComment({
        id: 'comment-456',
        content: 'Comment Content 2',
        date: '2023-11-17',
        username: 'alice',
        replies: [],
        is_delete: true,
        likeCount: 0,
      }),
    ];
    
    const mockThread = new DetailThread({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-11-19',
      username: 'john_doe',
      comments: [],
    });

    const mockThreadRepository = {
      verifyThreadAvailability: jest.fn().mockResolvedValue(),
      getThreadById: jest.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentByThreadId: jest.fn().mockResolvedValue(mockComments),
    };
    const mockReplyRepository = {
      getReplyByCommentId: jest.fn((commentId) => Promise.resolve(mockReplies[commentId] || [])),
    };

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    const result = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(useCasePayload);
    expect(mockReplyRepository.getReplyByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getReplyByCommentId).toHaveBeenCalledWith('comment-456');

    expect(result).toEqual(
      new FullDetailThread({
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2023-11-19',
        username: 'john_doe',
        comments: [
          {
            id: 'comment-123',
            content: 'Comment Content 1',
            date: '2023-11-18',
            username: 'jane_doe',
            likeCount: 0,
            replies: [
              {
                id: 'reply-123',
                content: 'Reply Content 1',
                date: '2023-11-18',
                username: 'bob',
              },
              {
                id: 'reply-124',
                content: '**balasan telah dihapus**',
                date: '2023-11-18',
                username: 'bob 2',
              },
            ],
          },
          {
            id: 'comment-456',
            content: '**komentar telah dihapus**',
            date: '2023-11-17',
            username: 'alice',
            likeCount: 0,
            replies: [],
          },
        ],
      }),
    );
  });

  it('should return thread without comments if no comments are found', async () => {
    // Arrange
    const useCasePayload = 'thread-125';

    const mockThread = new DetailThread({
      id: 'thread-125',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-11-19',
      username: 'user 1',
      comments: [],
    });

    const mockThreadRepository = {
      verifyThreadAvailability: jest.fn().mockResolvedValue(),
      getThreadById: jest.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentByThreadId: jest.fn().mockResolvedValue([]),
    };
    const mockReplyRepository = {
      getReplyByCommentId: jest.fn(),
    };

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    const result = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(useCasePayload);
    expect(mockReplyRepository.getReplyByCommentId).not.toHaveBeenCalled();

    expect(result).toEqual(
      new FullDetailThread({
        id: 'thread-125',
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2023-11-19',
        username: 'user 1',
        comments: [],
      }),
    );
  });

  it('should return thread with comments but without replies if replies are not found', async () => {
    const useCasePayload = 'thread-126';
  
    const mockComments = [
      new DetailComment({
        id: 'comment-126',
        content: 'Comment Content 1',
        date: '2023-11-18',
        username: 'jane_doe',
        is_delete: false,
        replies: [],
        likeCount: 0,
      }),
    ];
  
    const mockThread = new DetailThread({
      id: 'thread-126',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-11-19',
      username: 'john_doe',
      comments: [],
    });
  
    const mockThreadRepository = {
      verifyThreadAvailability: jest.fn().mockResolvedValue(),
      getThreadById: jest.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentByThreadId: jest.fn().mockResolvedValue(mockComments),
    };
    const mockReplyRepository = {
      getReplyByCommentId: jest.fn().mockResolvedValue([]),
    };
  
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
  
    const result = await getDetailThreadUseCase.execute(useCasePayload);
  
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(useCasePayload);
    expect(mockReplyRepository.getReplyByCommentId).toHaveBeenCalledWith('comment-126');
  
    expect(result).toEqual(
      new FullDetailThread({
        id: 'thread-126',
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2023-11-19',
        username: 'john_doe',
        comments: [
          {
            id: 'comment-126',
            content: 'Comment Content 1',
            date: '2023-11-18',
            username: 'jane_doe',
            likeCount: 0,
            replies: [],
          },
        ],
      }),
    );
  });
  
});
