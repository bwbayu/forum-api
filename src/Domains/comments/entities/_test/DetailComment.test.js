const DetailComment = require('../DetailComment');
/* eslint-disable no-undef */
describe('a DetailComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'This is a comment',
      date: '2024-11-15',
      username: 'user-123',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'This is a comment',
      date: '2024-11-15',
      is_delete: false,
      username: 123,
      replies: [],
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'This is a comment',
      date: '2024-11-15',
      is_delete: false,
      username: 'user-123',
      replies: [],
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual('comment-123');
    expect(detailComment.content).toEqual('This is a comment');
    expect(detailComment.date).toEqual('2024-11-15');
    expect(detailComment.is_delete).toEqual(false);
    expect(detailComment.username).toEqual('user-123');
    expect(detailComment.replies).toEqual([]);
  });
});
