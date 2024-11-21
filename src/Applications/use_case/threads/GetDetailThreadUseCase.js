const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comments = await this._commentRepository.getCommentByThreadId(useCasePayload);
    const detailThread = new DetailThread({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: [],
    });
    if (comments.length > 0) {
      for (const comment of comments) {

        if(comment.is_delete){
          comment.content = "**komentar telah dihapus**";
        }

        const commentDetail = new DetailComment({
          id: comment.id,
          content: comment.content,
          date: comment.date,
          username: comment.username,
          replies: [],
        });

        // get replies
        const replies = await this._replyRepository.getReplyByCommentId(commentDetail.id);
        if (replies.length > 0) {
          for (const reply of replies) {
            if(reply.is_delete){
              reply.content = "**balasan telah dihapus**";
            }
            const detailReply = new DetailReply({
              id: reply.id,
              content: reply.content,
              date: reply.date,
              username: reply.username,
            });

            commentDetail.replies.push(detailReply);
          }
        }
        // add comment and replies to thread
        detailThread.comments.push(commentDetail);
      }
    }

    return detailThread;
  }
}

module.exports = GetDetailThreadUseCase;
