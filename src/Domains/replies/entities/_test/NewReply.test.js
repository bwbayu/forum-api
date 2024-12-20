const NewReply = require('../NewReply');
/* eslint-disable no-undef */
describe('a reply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
      owner: 'user-123',
      thread_id: 'thread-123',
      comment_id: 'comment-123',
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    const payload = {
      content: 'ini balasan komentar',
      owner: 'user-123',
      thread_id: 'thread-123',
      comment_id: 'comment-123',
    };

    const reply = new NewReply(payload);

    expect(reply.content).toEqual('ini balasan komentar');
    expect(reply.owner).toEqual('user-123');
    expect(reply.thread_id).toEqual('thread-123');
    expect(reply.comment_id).toEqual('comment-123');
  });
});
