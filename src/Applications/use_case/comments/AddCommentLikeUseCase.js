class AddCommentLikeUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // validasi payload
    this._validatePayload(useCasePayload);
    const { thread_id, comment_id, owner } = useCasePayload;

    // validation
    await this._threadRepository.verifyThreadAvailability(thread_id);
    await this._commentRepository.verifyCommentAvailability(comment_id);
    return this._commentRepository.toggleCommentLike(comment_id, owner);
  }

  _validatePayload({ thread_id, comment_id, owner }) {
    if (!thread_id || !comment_id || !owner) {
      throw new Error('ADD_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (typeof thread_id !== 'string' || typeof comment_id !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentLikeUseCase;
