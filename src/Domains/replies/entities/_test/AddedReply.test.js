const AddedReply = require('../AddedReply');
/* eslint-disable no-undef */
describe('an AddedReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'This is a reply comment',
      owner: 456,
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'This is a reply comment',
      owner: 'user-123',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toEqual('reply-123');
    expect(addedReply.content).toEqual('This is a reply comment');
    expect(addedReply.owner).toEqual('user-123');
  });
});
