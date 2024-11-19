const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = await this._container.getInstance(AddReplyUseCase.name);
    const { id: user_id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const useCasePayload = {
      thread_id: threadId,
      content: request.payload.content,
      user_id,
      comment_id: commentId,
    };

    const addedReply = await addReplyUseCase.execute(useCasePayload);
    const response = h.response({
      status: 'success',
      data: {
        addedReply: {
          ...addedReply,
          owner: addedReply.user_id,
        },
      },
    });
    response.code(201);

    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = await this._container.getInstance(DeleteReplyUseCase.name);
    const { threadId, commentId, replyId } = request.params;
    const { id: user_id } = request.auth.credentials;
    const useCasePayload = {
      thread_id: threadId,
      comment_id: commentId,
      user_id,
      reply_id: replyId,
    };

    await deleteReplyUseCase.execute(useCasePayload);
    const response = h.response({
      status: 'success',
    });

    return response;
  }
}

module.exports = RepliesHandler;
