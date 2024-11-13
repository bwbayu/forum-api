const AddedThread = require("../AddedThread");

describe('a added thread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'abc',
            user_id : 'user-12345678'
        };

        expect(() => new AddedThread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'thread-12345678',
            title: 123,
            user_id : 'user-12345678'
        };

        expect(() => new AddedThread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create added thread object correctly', () => {
        const payload = {
            id: 'thread-12345678',
            title: 'thread 1',
            user_id: 'user-123345678',
        };

        const { id, title, user_id } = new AddedThread(payload);

        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(user_id).toEqual(payload.user_id);
    });
})