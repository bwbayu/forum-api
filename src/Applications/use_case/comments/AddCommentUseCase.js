const NewComment = require("../../../Domains/comments/entities/NewComment");

class AddCommentUseCase{
    constructor({CommentRepository, ThreadRepository, UserRepository}){
        this._commentRepository = CommentRepository;
        this._threadRepository = ThreadRepository;
        this._userRepository = UserRepository;
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
