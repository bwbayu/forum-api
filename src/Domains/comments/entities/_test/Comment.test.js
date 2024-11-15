const Comment = require("../Comment");

describe('a Comment entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {};

        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: 123,
        };

        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create comment object correctly', () => {
        const payload = {
            content: 'ini komentar',
        };

        const comment = new Comment(payload);

        expect(comment.content).toEqual(payload.content);
    });
});
