const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({
    commentRepository, threadRepository, replyRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { thread_id, comment_id } = useCasePayload;
    // validation
    await this._threadRepository.verifyThreadAvailability(thread_id);
    await this._commentRepository.verifyCommentAvailability(comment_id);

    const newReply = new NewReply(useCasePayload);
    const result =  await this._replyRepository.addReply(newReply);
    return result
  }
}

module.exports = AddReplyUseCase;
