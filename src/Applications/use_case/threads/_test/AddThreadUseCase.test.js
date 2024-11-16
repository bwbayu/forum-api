const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        const useCasePayload = {
            title: 'thread 1',
            body: 'isi thread 1',
            user_id: 'user-123'
        };

        const mockAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            user_id: useCasePayload.user_id,
        });

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.addThread = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAddedThread));

        // use case instance
        const getThreadUseCase = new AddThreadUseCase({
            ThreadRepository: mockThreadRepository,
        });

        const addedThread = await getThreadUseCase.execute(useCasePayload);

        // 
        expect(addedThread).toStrictEqual(new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            user_id: useCasePayload.user_id,
        }));
    })
});