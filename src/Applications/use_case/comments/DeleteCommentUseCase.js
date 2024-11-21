class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // validasi payload
    this._validatePayload(useCasePayload);
    const { thread_id, comment_id, owner } = useCasePayload;

    // validasi item
    await this._threadRepository.verifyThreadAvailability(thread_id);
    await this._commentRepository.verifyCommentAvailability(comment_id);
    await this._commentRepository.verifyCommentOwner(comment_id, owner);
    return this._commentRepository.deleteComment(comment_id);
  }

  _validatePayload({ thread_id, comment_id, owner }) {
    if (!thread_id || !comment_id || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (typeof thread_id !== 'string' || typeof comment_id !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
