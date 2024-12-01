const FullDetailThread = require('../FullDetailThread');
/* eslint-disable no-undef */
describe('a Full Detail Thread entities', () => {
  it('should throw error when payload did not contain needed property (thread)', () => {
    const payload = {
      title: 'thread 1',
      body: 'isi thread 1',
    };

    expect(() => new FullDetailThread(payload)).toThrowError('FULL_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification (thread)', () => {
    const payload = {
      id: 123,
      title: 'thread 1',
      body: 'isi thread 1',
      date: '2024-11-15',
      username: 456,
      comments: 'komen',
    };

    expect(() => new FullDetailThread(payload)).toThrowError('FULL_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain needed property (comment)', () => {
    const payload = {
        id: 'thread-123',
        title: 'thread 1',
        body: 'isi thread 1',
        date: '2024-11-15',
        username: 'dicoding',
        comments: [
            {
                content: 'This is a comment',
            },
        ],
      };

    expect(() => new FullDetailThread(payload)).toThrowError('FULL_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property (comment)', () => {
    const payload = {
        id: 'thread-123',
        title: 'thread 1',
        body: 'isi thread 1',
        date: '2024-11-15',
        username: 'dicoding',
        comments: [
            {
                id: 123,
                content: 'This is a comment',
                date: '2024-11-15',
                username: 456,
                replies: 'invalid replies',
                likeCount: 0,
            },
        ],
      };

    expect(() => new FullDetailThread(payload)).toThrowError('FULL_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain needed property (reply)', () => {
    const payload = {
        id: 'thread-123',
        title: 'thread 1',
        body: 'isi thread 1',
        date: '2024-11-15',
        username: 'dicoding',
        comments: [
            {
                id: 'comment-123',
                content: 'This is a comment',
                date: '2024-11-15',
                username: 'user 2',
                likeCount: 0,
                replies: [
                    {
                        content: 'This is a reply',
                    }
                ],
            },
        ],
      };

    expect(() => new FullDetailThread(payload)).toThrowError('FULL_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property (reply)', () => {
    const payload = {
        id: 'thread-123',
        title: 'thread 1',
        body: 'isi thread 1',
        date: '2024-11-15',
        username: 'dicoding',
        comments: [
            {
                id: 'comment-123',
                content: 'This is a comment',
                date: '2024-11-15',
                username: 'user 2',
                likeCount: 0,
                replies: [
                    {
                        id: 123,
                        content: 'This is a reply',
                        date: '2024-11-15',
                        username: 123,
                    }
                ],
            },
        ],
      };

    expect(() => new FullDetailThread(payload)).toThrowError('FULL_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create full detail thread object correctly', () => {
    const payload = {
        id: 'thread-123',
        title: 'thread 1',
        body: 'isi thread 1',
        date: '2024-11-15',
        username: 'dicoding',
        comments: [
            {
                id: 'comment-123',
                content: 'This is a comment',
                date: '2024-11-15',
                username: 'user 2',
                likeCount: 0,
                replies: [
                    {
                        id: 'reply-123',
                        content: 'This is a reply',
                        date: '2024-11-15',
                        username: 'user 3',
                    }
                ],
            },
        ],
    };

    const fullDetailThread = new FullDetailThread(payload);
    // check thread
    expect(fullDetailThread.id).toEqual(payload.id);
    expect(fullDetailThread.title).toEqual(payload.title);
    expect(fullDetailThread.body).toEqual(payload.body);
    expect(fullDetailThread.date).toEqual(payload.date);
    expect(fullDetailThread.username).toEqual(payload.username);
    expect(fullDetailThread.comments).toHaveLength(payload.comments.length);
    // check comment
    const comment = fullDetailThread.comments[0];
    expect(comment.id).toEqual(payload.comments[0].id);
    expect(comment.content).toEqual(payload.comments[0].content);
    expect(comment.date).toEqual(payload.comments[0].date);
    expect(comment.username).toEqual(payload.comments[0].username);
    expect(comment.likeCount).toEqual(payload.comments[0].likeCount);
    expect(comment.replies).toHaveLength(payload.comments[0].replies.length);
    // check reply
    const reply = comment.replies[0];
    expect(reply.id).toEqual(payload.comments[0].replies[0].id);
    expect(reply.content).toEqual(payload.comments[0].replies[0].content);
    expect(reply.date).toEqual(payload.comments[0].replies[0].date);
    expect(reply.username).toEqual(payload.comments[0].replies[0].username);
});
});
