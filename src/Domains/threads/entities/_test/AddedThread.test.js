const AddedThread = require('../AddedThread');
/* eslint-disable no-undef */
describe('a added thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'abc',
      owner: 'user-12345678',
    };

    expect(() => new AddedThread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-12345678',
      title: 123,
      owner: 'user-12345678',
    };

    expect(() => new AddedThread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create added thread object correctly', () => {
    const payload = {
      id: 'thread-12345678',
      title: 'thread 1',
      owner: 'user-123345678',
    };

    const { id, title, owner } = new AddedThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
