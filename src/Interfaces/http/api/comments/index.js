const CommentsHandler = require("./handler");
const routes = require("./route");

module.exports = {
    name: 'comments',
    register: async (server, {container}) => {
        const commentsHandler = new CommentsHandler(container);
        server.route(routes(commentsHandler));
    }
}