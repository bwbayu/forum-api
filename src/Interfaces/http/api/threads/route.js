const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads',
        handler: (request, h) => {
            return handler.postThreadHandler(request, h);
        },
        options: {
            auth: 'forum_jwt',
        },
    },
    {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: handler.getDetailThreadHandler,
    },
]);

module.exports = routes;
