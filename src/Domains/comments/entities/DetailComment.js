class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, date, username, is_delete, replies,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.is_delete = is_delete;
    this.replies = replies;
  }

  _verifyPayload({
    id, content, date, username, is_delete, replies,
  }) {
    if (!id || !content || !date || is_delete === undefined || !username || !replies) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
            || typeof content !== 'string'
            || !(date instanceof Date || typeof date === 'string')
            || typeof is_delete !== 'boolean'
            || typeof username !== 'string'
            || !Array.isArray(replies)) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
