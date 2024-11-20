class DeleteReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    // validasi payload
    this._validatePayload(useCasePayload);
    const {
      thread_id, comment_id, owner, reply_id,
    } = useCasePayload;

    // validasi item
    await this._threadRepository.getThreadById(thread_id);
    await this._commentRepository.getCommentById(comment_id);
    await this._replyRepository.getReplyById(reply_id);
    await this._replyRepository.verifyReplyOwner(reply_id, owner);
    return this._replyRepository.deleteReply(reply_id);
  }

  _validatePayload({
    thread_id, comment_id, owner, reply_id,
  }) {
    if (!thread_id || !comment_id || !owner || !reply_id) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (typeof thread_id !== 'string'
            || typeof comment_id !== 'string'
            || typeof owner !== 'string'
            || typeof reply_id !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
