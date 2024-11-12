class AddedThread {
    constructor(payload){
        this._verifyPayload(payload);
        const {id, title, userId} = payload;

        this.id = id;
        this.title = title;
        this.userId = userId;
    }

    _verifyPayload({id, title, userId}){
        if (!title || !userId || !id) {
            throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof userId !== 'string' || typeof id !== 'string') {
            throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddedThread;