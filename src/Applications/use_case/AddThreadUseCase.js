const Thread = require('../../Domains/threads/entities/Thread');

class AddThreadUseCase{
    constructor({ThreadRepository}){
        this._threadRepository = ThreadRepository;
    }

    async execute(useCasePayload, userPayload){
        const newThread = new Thread(useCasePayload);
        return this._threadRepository.addThread(newThread, userPayload);
    }
}

module.exports = AddThreadUseCase;
