const NewComment = require("../../../Domains/comments/entities/NewComment");

class AddCommentUseCase{
    constructor({commentRepository, threadRepository, userRepository}){
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
        this._userRepository = userRepository;
    }

    async execute(useCasePayload){
        const {user_id, thread_id} = useCasePayload;
        // validation
        await this._threadRepository.getThreadById(thread_id);
        await this._userRepository.getUserById(user_id);
        const newComment = new NewComment(useCasePayload);

        return this._commentRepository.addComment(newComment);
    }
}

module.exports = AddCommentUseCase;
