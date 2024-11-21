const NewComment = require('../NewComment');
/* eslint-disable no-undef */
describe('a Comment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
      owner: 'user-123',
      thread_id: 'thread-123',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    const payload = {
      content: 'ini komentar',
      owner: 'user-123',
      thread_id: 'thread-123',
    };

    const comment = new NewComment(payload);

    expect(comment.content).toEqual('ini komentar');
    expect(comment.owner).toEqual('user-123');
    expect(comment.thread_id).toEqual('thread-123');
  });
});
