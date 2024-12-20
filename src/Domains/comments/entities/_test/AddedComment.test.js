/* eslint-disable no-undef */
const AddedComment = require('../AddedComment');

describe('an AddedComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'This is a comment',
      owner: 'user-123',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'This is a comment',
      owner: 456,
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'This is a comment',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual('comment-123');
    expect(addedComment.content).toEqual('This is a comment');
    expect(addedComment.owner).toEqual('user-123');
  });
});
