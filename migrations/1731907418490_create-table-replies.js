/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('replies', {
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
      comment_id: {
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
      'replies',
      'fk_replies.user_id',
      'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
    );
  
    pgm.addConstraint(
      'replies',
      'fk_replies.thread_id',
      'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
    );

    pgm.addConstraint(
        'replies',
        'fk_replies.comment_id',
        'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
    );
  };
  
  exports.down = (pgm) => {
    pgm.dropConstraint('replies', 'fk_replies.user_id');
    pgm.dropConstraint('replies', 'fk_replies.thread_id');
    pgm.dropConstraint('replies', 'fk_replies.comment_id');
  
    pgm.dropTable('replies');
  };