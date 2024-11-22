/* eslint-disable no-undef */
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../../Domains/threads/entities/NewThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'thread 1',
      body: 'isi thread 1',
      owner: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn()
      .mockResolvedValue(mockAddedThread);

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new NewThread(useCasePayload));
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: 'thread 1',
      owner: 'user-123',
    }));
  });
});
