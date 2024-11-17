const DetailComment = require("../../../Domains/comments/entities/DetailComment");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");

class GetDetailThreadUseCase{
    constructor({threadRepository, commentRepository}){
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload){
        const thread = await this._threadRepository.getThreadById(useCasePayload);
        const comments = await this._commentRepository.getCommentByThreadId(useCasePayload);
        const detailThread = new DetailThread({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: thread.date,
            username: thread.username,
            comments: comments,
        });
        
        if (comments.length > 0) {
            for (const comment of comments) {
                const commentDetail = new DetailComment({
                    id: comment.id,
                    content: comment.content,
                    date: comment.date,
                    username: comment.username,
                });
                detailThread.comments.push(commentDetail);
            }
        }

        return detailThread;
    }
}

module.exports = GetDetailThreadUseCase;