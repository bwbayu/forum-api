const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/threads/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = await this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const useCasePayload = {
      title: request.payload.title,
      body: request.payload.body,
      owner,
    };
    
    const addedThread = await addThreadUseCase.execute(useCasePayload);
    const response = h.response({
      status: 'success',
      data: {
        addedThread
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThreadHandler(request, h) {
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const { threadId } = request.params;
    console.log(threadId);
    const thread = await getDetailThreadUseCase.execute(threadId);
    console.log(thread);
    const response = h.response({
      status: 'success',
      data: { thread },
    });
    console.log(response);
    return response;
  }
}

module.exports = ThreadsHandler;
