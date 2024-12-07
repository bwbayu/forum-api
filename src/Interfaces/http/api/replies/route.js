const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forum_jwt',
      description: 'Add a reply to a comment',
      notes: 'This endpoint allows authenticated users to reply to a specific comment in a thread.',
      tags: ['api', 'replies'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().example('thread-123').description('The ID of the thread'),
          commentId: Joi.string().required().example('comment-123').description('The ID of the comment'),
        }),
        payload: Joi.object({
          content: Joi.string().required().example('This is a reply').description('The content of the reply'),
        }).label('Post-reply-payload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success'),
          data: Joi.object({
            addedReply: Joi.object({
              id: Joi.string().example('reply-123'),
              content: Joi.string().example('This is a reply'),
              owner: Joi.string().example('user-123'),
            }),
          }),
        }).label('Post-reply-response'),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: 'forum_jwt',
      description: 'Delete a reply from a comment',
      notes: 'This endpoint allows authenticated users to delete their reply from a specific comment in a thread.',
      tags: ['api', 'replies'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().example('thread-123').description('The ID of the thread'),
          commentId: Joi.string().required().example('comment-123').description('The ID of the comment'),
          replyId: Joi.string().required().example('reply-123').description('The ID of the reply to delete'),
        }),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success'),
        }).label('Delete-reply-response'),
      },
    },
  },
]);

module.exports = routes;
