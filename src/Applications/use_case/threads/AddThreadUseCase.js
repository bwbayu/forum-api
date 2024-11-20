const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    const result = await this._threadRepository.addThread(newThread);

    return {"addedThread": result};
  }
}

module.exports = AddThreadUseCase;
