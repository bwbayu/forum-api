const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forum_jwt',
      description: 'Add a comment to a thread',
      notes: 'This endpoint allows authenticated users to add a comment to a specific thread.',
      tags: ['api', 'comments'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().description('ID of the thread'),
        }),
        payload: Joi.object({
          content: Joi.string().required().description('Content of the comment'),
        }).label('Post-comment-payload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success'),
          data: Joi.object({
            addedComment: Joi.object({
              id: Joi.string().example('comment-123'),
              content: Joi.string().example('This is a comment'),
              owner: Joi.string().example('user-123'),
            }),
          }),
        }).label('Post-comment-response'),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'forum_jwt',
      description: 'Delete a comment from a thread',
      notes: 'This endpoint allows authenticated users to delete a specific comment from a thread.',
      tags: ['api', 'comments'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().description('ID of the thread'),
          commentId: Joi.string().required().description('ID of the comment to delete'),
        }),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success'),
        }).label('Delete-comment-response'),
      },
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.toggleCommentLikeHandler,
    options: {
      auth: 'forum_jwt',
      description: 'Like or unlike a comment',
      notes: 'This endpoint allows authenticated users to toggle like on a specific comment in a thread.',
      tags: ['api', 'comments'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().description('ID of the thread'),
          commentId: Joi.string().required().description('ID of the comment to like/unlike'),
        }),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success'),
        }).label('Toggle-comment-like-response'),
      },
    },
  },
]);

module.exports = routes;
