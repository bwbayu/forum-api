class DeleteCommentUseCase{
    constructor({CommentRepository, ThreadRepository}){
        this._commentRepository = CommentRepository;
        this._threadRepository = ThreadRepository;
    }

    async execute(useCasePayload){
        // validasi payload
        this._validatePayload(useCasePayload);
        const { thread_id, comment_id, user_id } = useCasePayload;

        // validasi item
        await this._threadRepository.getThreadById(thread_id);
        await this._commentRepository.getCommentById(comment_id);
        await this._commentRepository.verifyCommentOwner(comment_id, user_id);
        return this._commentRepository.deleteComment(comment_id);
    }

    _validatePayload({ thread_id, comment_id, user_id }) {
        if (!thread_id || !comment_id || !user_id) {
          throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
        }
    
        if (typeof thread_id !== 'string' || typeof comment_id !== 'string' || typeof user_id !== 'string') {
          throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
      }
}

module.exports = DeleteCommentUseCase;
