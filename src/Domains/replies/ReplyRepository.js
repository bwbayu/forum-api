class ReplyRepository {
    async addReply(reply) {
      throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  
    async deleteReply(reply_id) {
      throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getReplyByCommentId(comment_id) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getReplyById(reply_id) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyReplyOwner(reply_id, user_id) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}
  
module.exports = ReplyRepository;
    