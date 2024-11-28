class FullDetailThread {
    constructor(payload) {
      this._verifyPayload(payload);
      const {
        id, title, body, date, username, comments,
      } = payload;
      this.id = id;
      this.title = title;
      this.body = body;
      this.date = date;
      this.username = username;
      this.comments = comments;
    }
  
    _verifyPayload({
      id, title, body, date, username, comments,
    }) {
      if (!id || !title || !body || !date || !username || !comments) {
        throw new Error('FULL_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof id !== 'string'
        || typeof title !== 'string'
        || typeof body !== 'string'
        || !(date instanceof Date || typeof date === 'string')
        || typeof username !== 'string'
        || !Array.isArray(comments)) {
        throw new Error('FULL_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }

    //   CHECK COMMENT
      for(let i = 0; i < comments.length; i++){
        if (!comments[i].id 
            || !comments[i].content 
            || !comments[i].date
            || !comments[i].username 
            || !comments[i].replies) {
            throw new Error('FULL_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }
      
        if (typeof comments[i].id !== 'string'
            || typeof comments[i].content !== 'string'
            || !(comments[i].date instanceof Date || typeof comments[i].date === 'string')
            || typeof comments[i].username !== 'string'
            || !Array.isArray(comments[i].replies)) {
        throw new Error('FULL_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        // CHECK REPLIES
        for(let j = 0; j < comments[i].replies.length; j++){
            if (!comments[i].replies[j].id 
                || !comments[i].replies[j].content 
                || !comments[i].replies[j].date 
                || !comments[i].replies[j].username) {
                throw new Error('FULL_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
              }
          
              if (typeof id !== 'string'
                      || typeof comments[i].replies[j].content !== 'string'
                      || !(comments[i].replies[j].date instanceof Date 
                      || typeof comments[i].replies[j].date === 'string')
                      || typeof comments[i].replies[j].username !== 'string') {
                throw new Error('FULL_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
              }
        }
      }
    }
  }
  
  module.exports = FullDetailThread;
  