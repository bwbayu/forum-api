const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'forum_jwt',
      description: 'Create a new thread',
      notes: 'This endpoint allows authenticated users to create a new thread.',
      tags: ['api', 'threads'],
      validate: {
        payload: Joi.object({
          title: Joi.string().required().example('My First Thread').description('The title of the thread'),
          body: Joi.string().required().example('This is the body of the thread').description('The body of the thread'),
        }).label('Post-thread-payload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success'),
          data: Joi.object({
            addedThread: Joi.object({
              id: Joi.string().example('thread-123'),
              title: Joi.string().example('My First Thread'),
              owner: Joi.string().example('user-123'),
            }),
          }),
        }).label('Post-thread-response'),
      },
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getDetailThreadHandler,
    options: {
      description: 'Get thread details',
      notes: 'This endpoint retrieves the details of a specific thread using its ID.',
      tags: ['api', 'threads'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().example('thread-123').description('The ID of the thread'),
        }),
      },
    },
  },
]);

module.exports = routes;
