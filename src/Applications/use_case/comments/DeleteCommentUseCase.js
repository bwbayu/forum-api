class DeleteCommentUseCase{
    constructor({CommentRepository}){
        this._commentRepository = CommentRepository;
    }

    async execute(commentPayload, userPayload){
        // validasi
        await this._commentRepository.verifyCommentOwner(commentPayload, userPayload);
        
        return this._commentRepository.deleteComment(commentPayload);
    }
}

module.exports = DeleteCommentUseCase;
