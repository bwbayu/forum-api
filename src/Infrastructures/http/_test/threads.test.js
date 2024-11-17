const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and create new thread', async () => {
            const server = await createServer(container);

            // Add user 
            const requestPayload = {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
            };
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            });

            // login
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };
            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            // get access token
            const responseAuth = JSON.parse(auth.payload);
            // add thread
            const threadPayload = {
                title: 'thread 1',
                body: 'isi thread 1',
            }
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: {
                  Authorization: `Bearer ${responseAuth.data.accessToken}`,
                },
            });

            // check response
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
        })
    })
})