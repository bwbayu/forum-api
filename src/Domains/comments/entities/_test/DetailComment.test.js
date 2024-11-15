const DetailComment = require("../DetailComment");

describe('a DetailComment entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'This is a comment',
            date: '2024-11-15',
            username: 'user-123'
        };

        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            content: 'This is a comment',
            date: '2024-11-15',
            username: 123,
        };

        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create detailComment object correctly', () => {
        const payload = {
            id: 'comment-123',
            content: 'This is a comment',
            date: '2024-11-15',
            username: 'user-123'
        };

        const detailComment = new DetailComment(payload);

        expect(detailComment.id).toEqual(payload.id);
        expect(detailComment.content).toEqual(payload.content);
        expect(detailComment.date).toEqual(payload.date);
        expect(detailComment.username).toEqual(payload.username);
    });
});
