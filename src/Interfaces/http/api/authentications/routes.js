const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler,
    options: {
      description: 'Login user and generate tokens',
      notes: 'Returns access token and refresh token for authenticated user',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          username: Joi.string().required().min(3).max(50).example('user123').description('User\'s username'),
          password: Joi.string().required().min(6).example('password123').description('User\'s password')
        }).label('Post-authentications-payload')
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success'),
          data: Joi.object({
            accessToken: Joi.string().required().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'),
            refreshToken: Joi.string().required().example('dGhpcyBpcyByZWZyZXNoIHRva2Vu')
          }).required()
        }).label('Post-authentications-response')
      }
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler,
    options: {
      description: 'Refresh access token',
      notes: 'Generates a new access token using the refresh token',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required().example('dGhpcyBpcyByZWZyZXNoIHRva2Vu').description('Refresh token')
        }).label('Put-authentications-payload')
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success'),
          data: Joi.object({
            accessToken: Joi.string().required().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
          }).required()
        }).label('Put-authentications-response')
      }
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
    options: {
      description: 'Logout user',
      notes: 'Removes refresh token to log out the user',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required().example('dGhpcyBpcyByZWZyZXNoIHRva2Vu').description('Refresh token to delete')
        }).label('Delete-authentications-payload')
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required().example('success')
        }).label('Delete-authentications-response')
      }
    },
  },
]);

module.exports = routes;
