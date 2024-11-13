const ThreadsHandler = require("./handler");
const routes = require("./route");

module.exports = {
    name: 'threads',
    register: async (server, {container}) => {
        const threadsHandler = new ThreadsHandler(container);
        server.route(routes(threadsHandler));
    }
}