const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres1 = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
/* eslint-disable no-undef */
describe('ThreadRepositoryPostgres', () => {
  const user_id = 'user-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: user_id });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      const thread = new NewThread({
        title: 'thread 1',
        body: 'isi thread 1',
        user_id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const ThreadRepositoryPostgres = new ThreadRepositoryPostgres1(pool, fakeIdGenerator);

      // Action
      await ThreadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const thread = new NewThread({
        title: 'thread 1',
        body: 'isi thread 1',
        user_id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const ThreadRepositoryPostgres = new ThreadRepositoryPostgres1(pool, fakeIdGenerator);

      // Action
      const addedThread = await ThreadRepositoryPostgres.addThread(thread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'thread 1',
        user_id: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError if no thread found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres1(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread when id is found', async () => {
      const threadPayload = {
        id: 'thread-123',
        user_id,
        title: 'thread 1',
        body: 'isi thread 1',
        created_at: new Date().toISOString(),
      }
      // Arrange
      await ThreadsTableTestHelper.addThread(threadPayload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres1(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread.title).toEqual('thread 1');
    });
  });
});
