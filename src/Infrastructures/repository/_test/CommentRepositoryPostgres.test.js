const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");

describe('CommentRepositoryPostgres', () => {
    const user_id = 'user-123';
    const thread_id = 'thread-123';

    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ id: user_id });
        await ThreadsTableTestHelper.addThread({ id: thread_id, user_id: user_id });
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist comment and return added comment correctly', async () => {
            const commentContent = 'This is a comment';
            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            const addedComment = await commentRepositoryPostgres.addComment(commentContent, thread_id, user_id);

            const comments = await CommentsTableTestHelper.findCommentById('comment-123');
            expect(comments).toHaveLength(1);
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: 'This is a comment',
                user_id: 'user-123',
            }));
        });

        it('should persist comment and return added comment correctly', async () => {
            const commentContent = 'This is a comment';
            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            const addedComment = await commentRepositoryPostgres.addComment(commentContent, thread_id, user_id);

            const comments = await CommentsTableTestHelper.findCommentById('comment-123');
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: 'This is a comment',
                user_id: 'user-123',
            }));
        });
    });

    describe('deleteComment function', () => {
        it('should mark comment as deleted', async () => {
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id, user_id });
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await commentRepositoryPostgres.deleteComment('comment-123');

            const comment = await CommentsTableTestHelper.findCommentById('comment-123');
            expect(comment).toHaveLength(1);
            expect(comment[0].is_delete).toEqual(true);
            expect(comment[0].content).toEqual('**komentar telah dihapus**');
        });

        it('should throw NotFoundError when deleting a non-existent comment', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.deleteComment('comment-789')).rejects.toThrowError(NotFoundError);
        });
    });

    describe('getCommentByThreadId function', () => {
        it('should return comments by thread ID', async () => {
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id, user_id, content: 'This is a comment' });
            await CommentsTableTestHelper.addComment({ id: 'comment-124', thread_id, user_id, content: 'This is a comment 2' });
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            const comments = await commentRepositoryPostgres.getCommentByThreadId(thread_id);

            expect(comments).toHaveLength(2);
        });

        it('should return empty array if no comments found for thread', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-789');

            expect(comments).toEqual([]);
        });
    });

    describe('getCommentById function', () => {
        it('should return the comment details when id is found', async () => {
            await CommentsTableTestHelper.addComment({
                id: 'comment-123', thread_id, user_id, content: 'This is a comment'
            });
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            const comment = await commentRepositoryPostgres.getCommentById('comment-123');

            expect(comment.id).toEqual('comment-123');
            expect(comment.content).toEqual('This is a comment');
        });

        it('should throw NotFoundError if comment id is not found', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.getCommentById('comment-999'))
                .rejects
                .toThrowError(NotFoundError);
        });
    });
})