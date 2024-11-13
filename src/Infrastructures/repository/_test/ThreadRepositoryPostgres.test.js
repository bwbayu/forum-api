const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres1 = require('../ThreadRepositoryPostgres');

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
            const thread = new Thread({
              title: 'thread 1',
              body: 'isi thread 1',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const ThreadRepositoryPostgres = new ThreadRepositoryPostgres1(pool, fakeIdGenerator);
      
            // Action
            await ThreadRepositoryPostgres.addThread(thread, user_id);
            
            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(threads).toHaveLength(1);
        });
      
        it('should return thread correctly', async () => {
            // Arrange
            const thread = new Thread({
                title: 'thread 1',
                body: 'isi thread 1',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const ThreadRepositoryPostgres = new ThreadRepositoryPostgres1(pool, fakeIdGenerator);
      
            // Action
            const addedThread = await ThreadRepositoryPostgres.addThread(thread, user_id);
      
            // Assert
            expect(addedThread).toStrictEqual(new AddedThread({
              id: 'thread-123',
              title: 'thread 1',
              user_id: 'user-123',
            }));
        });
    });
});