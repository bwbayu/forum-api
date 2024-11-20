const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({ id, thread_id, owner, comment_id, content, created_at, is_delete }) {
    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, thread_id, owner, comment_id, content, created_at, is_delete],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
