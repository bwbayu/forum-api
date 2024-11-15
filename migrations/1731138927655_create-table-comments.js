/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('comments', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      thread_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      content: {
        type: 'TEXT',
        notNull: true,
      },
      created_at: { 
        type: 'TIMESTAMP', 
        default: pgm.func('CURRENT_TIMESTAMP') 
      },
      is_delete: {
        type: 'BOOLEAN',
        notNull: true,
      },
    });
  
    pgm.addConstraint(
      'comments',
      'fk_comments.user_id',
      'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
    );
  
    pgm.addConstraint(
      'comments',
      'fk_comments.thread_id',
      'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
    );
  };
  
  exports.down = (pgm) => {
    pgm.dropConstraint('comments', 'fk_comments.user_id');
    pgm.dropConstraint('comments', 'fk_comments.thread_id');
  
    pgm.dropTable('comments');
  };