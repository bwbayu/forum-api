const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({
    commentRepository, threadRepository, userRepository, replyRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { user_id, thread_id, comment_id } = useCasePayload;
    // validation
    await this._commentRepository.getCommentById(comment_id);
    await this._threadRepository.getThreadById(thread_id);
    await this._userRepository.getUserById(user_id);

    const newReply = new NewReply(useCasePayload);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
