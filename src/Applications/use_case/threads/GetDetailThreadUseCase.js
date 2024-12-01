const FullDetailThread = require("../../../Domains/threads/entities/FullDetailThread");

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
    
    const processedComments = [];
    for (const comment of comments) {
      const content = comment.is_delete ? "**komentar telah dihapus**" : comment.content;

      const replies = await this._replyRepository.getReplyByCommentId(comment.id);

      const processedReplies = replies.map((reply) => ({
        id: reply.id,
        content: reply.is_delete ? "**balasan telah dihapus**" : reply.content,
        date: reply.date,
        username: reply.username,
      }));

      processedComments.push({
        id: comment.id,
        content,
        date: comment.date,
        username: comment.username,
        replies: processedReplies,
        likeCount: comment.likeCount,
      });
    }

    const fullDetailThread = new FullDetailThread({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: processedComments,
    });
    
    return fullDetailThread;
  }
}

module.exports = GetDetailThreadUseCase;
