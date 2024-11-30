/* eslint-disable no-undef */
const AddCommentLike = require('../AddCommentLike');

describe('an AddCommentLike entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
          owner: 'user-123'
        };
    
        expect(() => new AddCommentLike(payload)).toThrowError('ADD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
          thread: 123,
          comment: 'comment-123',
          owner: 'user-123',
        };
    
        expect(() => new AddCommentLike(payload)).toThrowError('ADD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddCommentLike object correctly', () => {
        const payload = {
            thread: 'thread-123',
            comment: 'comment-123',
            owner: 'user-123',
          };
    
        const data = new AddCommentLike(payload);
    
        expect(data.thread).toEqual('thread-123');
        expect(data.comment).toEqual('comment-123');
        expect(data.owner).toEqual('user-123');
    });
})