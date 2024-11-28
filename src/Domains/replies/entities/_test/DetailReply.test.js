const DetailReply = require('../DetailReply');
/* eslint-disable no-undef */
describe('a DetailReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'This is a reply comment',
      date: '2024-11-15',
      username: 123,
      is_delete: false,
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'This is a reply comment',
      date: '2024-11-15',
      username: 'user-123',
      is_delete: false,
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply.id).toEqual('reply-123');
    expect(detailReply.content).toEqual('This is a reply comment');
    expect(detailReply.date).toEqual('2024-11-15');
    expect(detailReply.username).toEqual('user-123');
    expect(detailReply.is_delete).toEqual(false);
  });
});
