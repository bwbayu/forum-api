const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123',
        thread_id = 'thread-123',
        user_id = 'user-123',
        content = 'This is a comment',
        created_at = new Date().toISOString(),
        is_delete = false,
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)',
            values: [id, thread_id, user_id, content, created_at, is_delete],
        };

        await pool.query(query);
    },

    async findCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = CommentsTableTestHelper;
