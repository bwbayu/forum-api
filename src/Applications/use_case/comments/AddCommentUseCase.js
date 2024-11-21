const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { thread_id } = useCasePayload;
    // validation
    await this._threadRepository.verifyThreadAvailability(thread_id);
    const newComment = new NewComment(useCasePayload);

    const result = await this._commentRepository.addComment(newComment);
    return result
  }
}

module.exports = AddCommentUseCase;
