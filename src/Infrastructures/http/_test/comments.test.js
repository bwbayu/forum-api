const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
    let server;

    beforeAll(async () => {
        server = await createServer(container);
    });

    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    const addUserAndGetAccessToken = async (username = 'dicoding') => {
        const userPayload = {
            username,
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        };

        await server.inject({
            method: 'POST',
            url: '/users',
            payload: userPayload,
        });

        const loginPayload = {
            username,
            password: 'secret',
        };

        const loginResponse = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: loginPayload,
        });

        const responseJson = JSON.parse(loginResponse.payload);
        return responseJson.data.accessToken;
    };

    const addThread = async (accessToken) => {
        const threadPayload = {
            title: 'thread 1',
            body: 'isi thread 1',
        };

        const response = await server.inject({
            method: 'POST',
            url: '/threads',
            payload: threadPayload,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const responseJson = JSON.parse(response.payload);
        return responseJson.data.addedThread.id;
    }

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and create new comment', async () => {
            const accessToken = await addUserAndGetAccessToken();
            const thread_id = await addThread(accessToken);

            // add comment
            const commentPayload = {
                content: 'komentar pertama',
            };

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${thread_id}/comments`,
                payload: commentPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
            expect(responseJson.data.addedComment.content).toEqual(commentPayload.content);
        });

        it('should response 400 if payload not contain needed property', async () => {
            const accessToken = await addUserAndGetAccessToken();
            const thread_id = await addThread(accessToken);

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${thread_id}/comments`,
                payload: {},
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
        });

        it('should response 401 if no authorization', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: { content: 'komentar tanpa token' },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
        });

        it('should respond 404 if the thread does not exist', async () => {
            const accessToken = await addUserAndGetAccessToken();

            const response = await server.inject({
                method: 'POST',
                url: `/threads/thread-123/comments`,
                payload: { content: 'komentar untuk thread tidak valid' },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });
    })

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 and delete the comment', async () => {
            const accessToken = await addUserAndGetAccessToken();
            const threadId = await addThread(accessToken);

            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: { content: 'komentar yang akan dihapus' },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const commentId = JSON.parse(commentResponse.payload).data.addedComment.id;

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 403 if deleting other user comment', async () => {
            const accessToken = await addUserAndGetAccessToken();
            const accessToken2 = await addUserAndGetAccessToken('decoding');
            const threadId = await addThread(accessToken);

            // second user add comment to first user thread
            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: { content: 'komentar orang lain' },
                headers: {
                    Authorization: `Bearer ${accessToken2}`,
                },
            });

            // first user try to delete the comment that post by second user
            const commentId = JSON.parse(commentResponse.payload).data.addedComment.id;
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
        });

        it('should response 404 if comment does not exist', async () => {
            const accessToken = await addUserAndGetAccessToken();
            const threadId = await addThread(accessToken);

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/comment-123`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });
    });
})