const AddCommentUseCase = require("../../../../Applications/use_case/comments/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/comments/DeleteCommentUseCase");

class CommentsHandler{
    constructor(container){
        this._container = container;
        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler(request, h){
        const addCommentUseCase = await this._container.getInstance(AddCommentUseCase.name);
        const { id: user_id } = request.auth.credentials;
        const { threadId } = request.params;
        const useCasePayload = {
            thread_id: threadId,
            content: request.payload.content,
            user_id
        }

        const addedComment = await addCommentUseCase.execute(useCasePayload);
        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);

        return response;
    }

    async deleteCommentHandler(request, h){
        const deleteCommentUseCase = await this._container.getInstance(DeleteCommentUseCase.name);
        const { threadId, commentId } = request.params;
        const { id: user_id } = request.auth.credentials;
        const useCasePayload = {
            thread_id: threadId,
            comment_id: commentId,
            user_id
        }

        await deleteCommentUseCase.execute(useCasePayload);
        const response = h.response({
            status: 'success',
        });
        
        return response;
    }
}

module.exports = CommentsHandler;
