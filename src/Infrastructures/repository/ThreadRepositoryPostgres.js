const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator){
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(thread, user_id){
        const {title, body} = thread;
        const id = `thread-${this._idGenerator()}`;
        const created_at = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, user_id AS owner',
            values: [id, user_id, title, body, created_at]
        };

        const result = await this._pool.query(query);
        return new AddedThread({ ...result.rows[0] });
    }

    async getThreadById(thread_id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id=$1',
            values: [thread_id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new InvariantError('thread tidak ditemukan');
        }

        return result.rows[0];
    }
}

module.exports = ThreadRepositoryPostgres;
