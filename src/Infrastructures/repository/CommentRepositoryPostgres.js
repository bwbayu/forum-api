const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { content, thread_id, owner } = comment;
    const id = `comment-${this._idGenerator()}`;
    const created_at = new Date().toISOString();
    const is_delete = false;

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner;',
      values: [id, thread_id, owner, content, created_at, is_delete],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(comment_id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id;',
      values: [comment_id],
    };

    const result = await this._pool.query(query);
    
    if (!result.rowCount) {
      throw new NotFoundError('Comment failed to delete. Id not found.');
    }
  }

  async getCommentByThreadId(thread_id) {
    const query = {
      text: 'SELECT c.id, u.username, c.created_at AS date, c.content, c.is_delete FROM comments AS c LEFT JOIN users u ON c.owner = u.id WHERE c.thread_id = $1 ORDER BY c.created_at ASC;',
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async getCommentById(comment_id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1;',
      values: [comment_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comments not found.');
    }

    return result.rows[0];
  }

  async verifyCommentOwner(comment_id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2;',
      values: [comment_id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('You do not have access to delete this comment.');
    }
  }

  async verifyCommentAvailability(comment_id){
    const query = {
      text: "SELECT id FROM comments WHERE id = $1",
      values: [comment_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
