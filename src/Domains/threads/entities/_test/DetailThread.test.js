const DetailThread = require("../DetailThread");

describe('a Detail Thread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'thread 1',
            body: 'isi thread 1',
        };

        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            title: 'thread 1',
            body: 'isi thread 1',
            date: '2024-11-15',
            username: 456,
            comments: 'komen',
        };

        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create detail thread object correctly', () => {
        const payload = {
            id: 'thread-123',
            title: 'thread 1',
            body: 'isi thread 1',
            date: '2024-11-15',
            username: 'user-123',
            comments: [
                { id: 'comment-1', content: 'This is a comment', username: 'user-1', date: '2024-11-15' },
            ],
        };

        const detailThread = new DetailThread(payload);

        expect(detailThread.id).toEqual(payload.id);
        expect(detailThread.title).toEqual(payload.title);
        expect(detailThread.body).toEqual(payload.body);
        expect(detailThread.date).toEqual(payload.date);
        expect(detailThread.username).toEqual(payload.username);
        expect(detailThread.comments).toEqual(payload.comments);
    });
});
