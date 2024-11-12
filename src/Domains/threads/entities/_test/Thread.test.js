const Thread = require("../Thread");

describe('a Thread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'abc',
        };

        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            title: 123,
            body: 'abc',
        };

        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
    it('should throw error when title contains more than 50 character', () => {
        const payload = {
            title: 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf',
            body: 'abc',
        };

        expect(() => new Thread(payload)).toThrowError('THREAD.TITLE_LIMIT_CHAR');
    });

    it('should create registerUser object correctly', () => {
        const payload = {
            title: 'thread 1',
            body: 'isi thread 1',
        };

        const { title, body } = new Thread(payload);

        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
})