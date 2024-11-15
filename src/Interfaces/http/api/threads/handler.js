const AddThreadUseCase = require("../../../../Applications/use_case/threads/AddThreadUseCase");

class ThreadsHandler{
    constructor(container){
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
    }

    async postThreadHandler(request, h){
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const { id: user_id } = request.auth.credentials;
        const addedThread = await addThreadUseCase.execute(request.payload, user_id);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;
