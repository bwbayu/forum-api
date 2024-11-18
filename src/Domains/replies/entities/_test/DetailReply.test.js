const DetailReply = require("../DetailReply");

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
        };

        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create detailReply object correctly', () => {
        const payload = {
            id: 'reply-123',
            content: 'This is a reply comment',
            date: '2024-11-15',
            username: 'user-123',
        };

        const detailReply = new DetailReply(payload);

        expect(detailReply.id).toEqual(payload.id);
        expect(detailReply.content).toEqual(payload.content);
        expect(detailReply.username).toEqual(payload.username);
    });
});
