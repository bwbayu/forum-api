const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator){
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(content, thread_id, user_id){
        const id = `comment-${this._idGenerator()}`;
        const created_at = new Date().toISOString();
        const is_delete = false;

        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, user_id;',
            values: [id, thread_id, user_id, content, created_at, is_delete]
        };

        const result = await this._pool.query(query);
        return new AddedComment({ ...result.rows[0] });
    }

    async deleteComment(id){
        const content = '**komentar telah dihapus**'
        const query = {
            text: 'UPDATE comments SET content = $1, is_delete = true WHERE id = $2  RETURNING id;',
            values: [content, id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
          throw new NotFoundError('Comment failed to delete. Id not found.');
        }
    }

    async getCommentByThreadId(thread_id){
        const query = {
            text: 'SELECT id, user_id, created_at as date, content FROM comments WHERE thread_id=$1 ORDER BY created_at ASC;',
            values: [thread_id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            return [];
        }
        
        return result.rows;
    }

    async getCommentById(id){
        const query = {
            text: 'SELECT * FROM comments WHERE id=$1;',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Comments not found.');
        }
        
        return result.rows[0];
    }
}

module.exports = CommentRepositoryPostgres;
