class NewComment {
    constructor(payload){
        this._verifyPayload(payload);
        const {content, user_id, thread_id} = payload;

        this.content = content;
        this.user_id = user_id;
        this.thread_id = thread_id;
    }

    _verifyPayload({content, user_id, thread_id}){
        if (!content || !user_id || !thread_id) {
            throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof user_id !== 'string' || typeof thread_id !== 'string') {
            throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = NewComment;
