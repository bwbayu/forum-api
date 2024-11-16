const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator){
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(thread){
        const {title, body, user_id} = thread;
        const id = `thread-${this._idGenerator()}`;
        const created_at = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, user_id',
            values: [id, user_id, title, body, created_at]
        };

        const result = await this._pool.query(query);
        return new AddedThread({ ...result.rows[0] });
    }

    async getThreadById(thread_id) {
        const query = {
            text: 'SELECT t.id, t.title, t.body, t.created_at AS date, u.username FROM threads AS t LEFT JOIN users AS u ON t.user_id = u.id WHERE t.id = $1',
            values: [thread_id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return result.rows[0];
    }
}

module.exports = ThreadRepositoryPostgres;
