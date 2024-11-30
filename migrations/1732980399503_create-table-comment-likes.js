exports.up = (pgm) => {
    pgm.createTable('comment_likes', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      comment_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      is_delete: {
        type: 'BOOLEAN',
        notNull: true,
      },
    });
  
    pgm.addConstraint('comment_likes', 'unique_owner_comment_id', 'UNIQUE(owner, comment_id)');
  
    pgm.addConstraint(
      'comment_likes',
      'fk_comment_likes.owner',
      'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
    );
  
    pgm.addConstraint(
      'comment_likes',
      'fk_comment_likes.comment_id',
      'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
    );
  };
  
  exports.down = (pgm) => {
    pgm.dropConstraint('comment_likes', 'unique_owner_comment_id');
    pgm.dropConstraint('comment_likes', 'fk_comment_likes.owner');
    pgm.dropConstraint('comment_likes', 'fk_comment_likes.comment_id');
    pgm.dropTable('comment_likes');
  };