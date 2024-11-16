const Comment = require("../../../Domains/comments/entities/Comment");

class AddCommentUseCase{
    constructor({CommentRepository, ThreadRepository, UserRepository}){
        this._commentRepository = CommentRepository;
        this._threadRepository = ThreadRepository;
        this._userRepository = UserRepository;
    }

    async execute(useCasePayload, threadPayload, userPayload){
        // validation
        const content = new Comment(useCasePayload);
        const thread = await this._threadRepository.getThreadById(threadPayload);
        const user = await this._userRepository.getUserById(userPayload);

        return this._commentRepository.addComment(content, thread.id, user.id);
    }
}

module.exports = AddCommentUseCase;
