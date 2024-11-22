const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
/* eslint-disable no-undef */
describe('/replies endpoint', () => {
  let server;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
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
  };

  const addComment = async (accessToken, thread_id) => {
    const commentPayload = {
      content: 'komentar 1',
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
    return responseJson.data.addedComment.id;
  };

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and create new reply', async () => {
      const accessToken = await addUserAndGetAccessToken();
      const thread_id = await addThread(accessToken);
      const comment_id = await addComment(accessToken, thread_id);

      // add reply
      const replyPayload = {
        content: 'balasan komentar pertama',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual('balasan komentar pertama');
    });

    it('should response 400 if payload not contain needed property', async () => {
      const accessToken = await addUserAndGetAccessToken();
      const thread_id = await addThread(accessToken);
      const comment_id = await addComment(accessToken, thread_id);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena data tidak lengkap');
    });

    it('should response 400 if payload not meet data type specification', async () => {
      const accessToken = await addUserAndGetAccessToken();
      const thread_id = await addThread(accessToken);
      const comment_id = await addComment(accessToken, thread_id);
      const replyPayload = {
        content: 123,
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
    });

    it('should response 401 if no authorization', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: { content: 'balasan komentar tanpa token' },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual(
        "Missing authentication"
      );
    });

    it('should respond 404 if the thread does not exist', async () => {
      const accessToken = await addUserAndGetAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/comment-123/replies`,
        payload: { content: 'balasan komentar untuk komentar tidak valid' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        "thread tidak ditemukan"
      );
    });

    it('should respond 404 if the comment does not exist', async () => {
      const accessToken = await addUserAndGetAccessToken();
      const thread_id = await addThread(accessToken);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/comment-123/replies`,
        payload: { content: 'balasan komentar untuk komentar tidak valid' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        "komentar tidak ditemukan"
      );
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete the reply', async () => {
      const accessToken = await addUserAndGetAccessToken();
      const thread_id = await addThread(accessToken);
      const comment_id = await addComment(accessToken, thread_id);

      // add reply
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: { content: 'balasan komentar yang akan dihapus' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // get reply id
      const reply_id = JSON.parse(replyResponse.payload).data.addedReply.id;

      // delete reply
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}/replies/${reply_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // check
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 if deleting other user reply', async () => {
      const accessToken = await addUserAndGetAccessToken();
      const accessToken2 = await addUserAndGetAccessToken('decoding');
      const thread_id = await addThread(accessToken);
      const comment_id = await addComment(accessToken, thread_id);

      // second user add reply comment to first user comment
      const replyPayload = {
        content: 'balasan komentar user 2 dari komentar user 1',
      };

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });
      
      // get reply id from above reply and user 1 will trying to delete it
      const reply_id = JSON.parse(replyResponse.payload).data.addedReply.id;

      // first user try to delete the reply that post by second user
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}/replies/${reply_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        "You do not have access to delete this reply."
      );
    });

    it('should response 404 if thread does not exist', async () => {
      const accessToken = await addUserAndGetAccessToken();

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/comment-123/replies/reply-999`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        "thread tidak ditemukan"
      );
    });

    it('should response 404 if thread does not exist', async () => {
      const accessToken = await addUserAndGetAccessToken();
      const thread_id = await addThread(accessToken);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/comment-123/replies/reply-999`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        "komentar tidak ditemukan"
      );
    });

    it('should response 404 if reply does not exist', async () => {
      const accessToken = await addUserAndGetAccessToken();
      const thread_id = await addThread(accessToken);
      const comment_id = await addComment(accessToken, thread_id);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}/replies/reply-999`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        "balasan tidak ditemukan"
      );
    });
  });
});
