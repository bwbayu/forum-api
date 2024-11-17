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

            const response = await server.inject({ //PERBAIKI STRUKTUR RESPONSE GANTI USER_ID KE OWNER
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
            expect(responseJson.data.addedThread.title).toEqual('thread 1');
        })

        it('should response 401 if no authorization', async () => {
            const server = await createServer(container);

            // wrong access token
            const accessToken = "token-123";

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
                  Authorization: `Bearer ${accessToken}`,
                },
            });

            // check response
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
        })

        it('should response 400 if payload not contain needed property', async () => {
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
            }
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: {
                  Authorization: `Bearer ${responseAuth.data.accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
        })

        it('should response 400 if payload not meet data type specification', async () => {
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
                body: 123
            }
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: {
                  Authorization: `Bearer ${responseAuth.data.accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
        })
    })

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and return detail thread', async () => {
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
            
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: {
                  Authorization: `Bearer ${responseAuth.data.accessToken}`,
                },
            });

            const threadResponse = JSON.parse(thread.payload);

            // get detail thread
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadResponse.data.addedThread.id}`,
                headers: { 
                    Authorization: `Bearer ${responseAuth.data.accessToken}` 
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread.id).toEqual(threadResponse.data.addedThread.id);
            expect(responseJson.data.thread.title).toEqual('thread 1');
            expect(responseJson.data.thread.body).toEqual('isi thread 1');
            expect(responseJson.data.thread.username).toEqual('dicoding');
            expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
        })

        it('should response 404 when thread not valid', async () => {
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
            // get detail thread
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
                headers: { 
                    Authorization: `Bearer ${responseAuth.data.accessToken}` 
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        })
    })
})