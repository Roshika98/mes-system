import { messageBus } from './message-bus';

describe('messageBus', () => {
  it('should work', () => {
    expect(messageBus()).toEqual('message-bus');
  });
});
