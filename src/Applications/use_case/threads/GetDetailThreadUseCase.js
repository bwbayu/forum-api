class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    // validasi
    await this._threadRepository.verifyThreadAvailability(useCasePayload);

    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comments = await this._commentRepository.getCommentByThreadId(useCasePayload);
    if (comments.length > 0) {
      for (const comment of comments) {
        if(comment.is_delete){
          comment.content = "**komentar telah dihapus**";
        }

        // get replies
        const replies = await this._replyRepository.getReplyByCommentId(comment.id);
        if (replies.length > 0) {
          for (const reply of replies) {
            if(reply.is_delete){
              reply.content = "**balasan telah dihapus**";
            }
            
            comment.replies.push(reply);
          }
        }
        // add comment and replies to thread
        thread.comments.push(comment);
      }
    }
    return thread;
  }
}

module.exports = GetDetailThreadUseCase;
