class AddedThread {
    constructor(payload){
        this._verifyPayload(payload);
        const {id, title, user_id} = payload;

        this.id = id;
        this.title = title;
        this.user_id = user_id;
    }

    _verifyPayload({id, title, user_id}){
        if (!title || !user_id || !id) {
            throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof user_id !== 'string' || typeof id !== 'string') {
            throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddedThread;
