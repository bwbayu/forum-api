const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase{
    constructor({ThreadRepository}){
        this._threadRepository = ThreadRepository;
    }

    async execute(useCasePayload, userPayload){
        const newThread = new NewThread(useCasePayload);
        return this._threadRepository.addThread(newThread, userPayload);
    }
}

module.exports = AddThreadUseCase;
