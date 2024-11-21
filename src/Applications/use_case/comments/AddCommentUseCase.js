const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const { owner, thread_id } = useCasePayload;
    // validation
    await this._threadRepository.getThreadById(thread_id);
    await this._userRepository.getUserById(owner);
    const newComment = new NewComment(useCasePayload);

    const result = await this._commentRepository.addComment(newComment);
    return result
  }
}

module.exports = AddCommentUseCase;
