const AddThreadUseCase = require("../../../../Applications/use_case/threads/AddThreadUseCase");
const GetDetailThreadUseCase = require("../../../../Applications/use_case/threads/GetDetailThreadUseCase");

class ThreadsHandler{
    constructor(container){
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
    }

    async postThreadHandler(request, h){
        const addThreadUseCase = await this._container.getInstance(AddThreadUseCase.name);
        const { id: user_id } = request.auth.credentials;
        const useCasePayload = {
            title: request.payload.title,
            body: request.payload.body,
            user_id
        }
        const addedThread = await addThreadUseCase.execute(useCasePayload);
        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);

        return response;
    }

    async getDetailThreadHandler(request, h){
        const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);

        const { threadId } = request.params;
        const thread = await getDetailThreadUseCase.execute(threadId);
        const response = h.response({
            status: 'success',
            data: { thread },
        });
        return response;
    }
}

module.exports = ThreadsHandler;
