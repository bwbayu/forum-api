class AddCommentLike {
    constructor(payload) {
      this._verifyPayload(payload);
      const { thread, comment, owner } = payload;
  
      this.thread = thread;
      this.comment = comment;
      this.owner = owner;
    }
  
    _verifyPayload({ thread, comment, owner }) {
      if (!thread || !comment || !owner) {
        throw new Error('ADD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof thread !== 'string' || typeof comment !== 'string' || typeof owner !== 'string') {
        throw new Error('ADD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
  
  module.exports = AddCommentLike;
  