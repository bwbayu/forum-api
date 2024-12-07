const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      description: 'Register a new user',
      notes: 'This endpoint allows you to register a new user by providing the necessary user details.',
      tags: ['api', 'users'],
      validate: {
        payload: Joi.object({
          username: Joi.string().required().min(3).max(50).example('johndoe').description('The username of the user'),
          password: Joi.string().required().min(6).example('password123').description('The password of the user'),
          fullname: Joi.string().required().example('John Doe').description('The full name of the user'),
        }).label('Post-user-payload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success'),
          data: Joi.object({
            addedUser: Joi.object({
              id: Joi.string().example('user-123'),
              username: Joi.string().example('johndoe'),
              fullname: Joi.string().example('John Doe'),
            }),
          }),
        }).label('Post-user-response'),
      },
    },
  },
]);

module.exports = routes;
