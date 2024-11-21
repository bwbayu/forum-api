const DetailThread = require('../DetailThread');
/* eslint-disable no-undef */
describe('a Detail Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'thread 1',
      body: 'isi thread 1',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'thread 1',
      body: 'isi thread 1',
      date: '2024-11-15',
      username: 456,
      comments: 'komen',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detail thread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread 1',
      body: 'isi thread 1',
      date: '2024-11-15',
      username: 'user-123',
      comments: [
        {
          id: 'comment-1', content: 'This is a comment', username: 'user-1', date: '2024-11-15',
        },
      ],
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toEqual('thread-123');
    expect(detailThread.title).toEqual('thread 1');
    expect(detailThread.body).toEqual('isi thread 1');
    expect(detailThread.date).toEqual('2024-11-15');
    expect(detailThread.username).toEqual('user-123');
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
