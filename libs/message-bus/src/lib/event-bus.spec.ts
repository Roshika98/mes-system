import EventBus from './event-bus';

describe('EventBus', () => {
  it('should work', () => {
    expect(EventBus.CreateEventBus('test').connect()).toEqual('test');
  });
});
