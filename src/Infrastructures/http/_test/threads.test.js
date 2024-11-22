const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
/* eslint-disable no-undef */
describe('/threads endpoint', () => {
  let server;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  const addUserAndGetAccessToken = async () => {
    const userPayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });

    const loginPayload = {
      username: 'dicoding',
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

  describe('when POST /threads', () => {
    it('should response 201 and create new thread', async () => {
      const accessToken = await addUserAndGetAccessToken();

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
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual('thread 1');
    });

    it('should response 401 if no authorization', async () => {
      const threadPayload = {
        title: 'thread 1',
        body: 'isi thread 1',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual(
        "Missing authentication"
      );
    });

    it('should response 400 if payload not contain needed property', async () => {
      const accessToken = await addUserAndGetAccessToken();

      const threadPayload = { title: 'thread 1' };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena data tidak lengkap');
    });

    it('should response 400 if payload not meet data type specification', async () => {
      const accessToken = await addUserAndGetAccessToken();

      const threadPayload = {
        title: 'thread 1',
        body: 123,
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
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 400 when title more than 50 character', async () => {
      const accessToken = await addUserAndGetAccessToken();

      const threadPayload = {
        title: 'kasjfaklsdjfklsdjafkljsadkfjklsdjafkjasdkfjakldsjflkdsajfkdjsafls',
        body: 'body 123',
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
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('panjang judul tidak boleh lebih dari 50');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return detail thread', async () => {
      const accessToken = await addUserAndGetAccessToken();

      const threadPayload = {
        title: 'thread 1',
        body: 'isi thread 1',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadData = JSON.parse(threadResponse.payload).data.addedThread;
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadData.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual(threadData.id);
      expect(responseJson.data.thread.title).toEqual('thread 1');
      expect(responseJson.data.thread.body).toEqual('isi thread 1');
      expect(responseJson.data.thread.username).toEqual('dicoding');
      expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
    });

    it('should response 404 when thread not found', async () => {
      const accessToken = await addUserAndGetAccessToken();

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
