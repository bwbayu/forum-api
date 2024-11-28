const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const {
      content, thread_id, owner, comment_id,
    } = reply;
    const id = `reply-${this._idGenerator()}`;
    const created_at = new Date().toISOString();
    const is_delete = false;

    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner;',
      values: [id, thread_id, owner, comment_id, content, created_at, is_delete],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(reply_id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id;',
      values: [reply_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply failed to delete. Id not found.');
    }
  }

  async getReplyByCommentId(comment_id) {
    const query = {
      text: 'SELECT r.id, u.username, r.created_at AS date, r.content, r.is_delete FROM replies AS r LEFT JOIN users u ON r.owner = u.id WHERE r.comment_id = $1 ORDER BY r.created_at ASC;',
      values: [comment_id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }

    return result.rows.map((reply) => new DetailReply(reply));
  }

  async getReplyById(reply_id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id=$1;',
      values: [reply_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Replies not found.');
    }

    return result.rows[0];
  }

  async verifyReplyOwner(reply_id, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2;',
      values: [reply_id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('You do not have access to delete this reply.');
    }
  }

  async verifyReplyAvailability(reply_id){
    const query = {
      text: "SELECT id FROM replies WHERE id = $1",
      values: [reply_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
