const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async toggleCommentLikes({ id, comment_id, owner, is_delete }) {
    const query = {
      text: `
        INSERT INTO comment_likes (id, owner, comment_id, is_delete)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (comment_id, owner)
        DO UPDATE SET is_delete = NOT comment_likes.is_delete
        RETURNING id;
      `,
      values: [id, owner, comment_id, is_delete],
    };

    await pool.query(query);
  },

  async findCommentLikes(comment_id, owner) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND owner = $2;',
      values: [comment_id, owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;