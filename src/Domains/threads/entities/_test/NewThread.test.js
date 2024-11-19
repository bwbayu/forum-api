const NewThread = require('../NewThread');
/* eslint-disable no-undef */
describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'abc',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: 'abc',
      user_id: 'user-123',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 50 character', () => {
    const payload = {
      title: 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf',
      body: 'abc',
      user_id: 'user-123',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create thread object correctly', () => {
    const payload = {
      title: 'thread 1',
      body: 'isi thread 1',
      user_id: 'user-123',
    };

    const { title, body, user_id } = new NewThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(user_id).toEqual(payload.user_id);
  });
});
