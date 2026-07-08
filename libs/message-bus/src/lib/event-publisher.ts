import { Producer } from 'kafkajs';
import { IEventPublish } from './types/event-publisher.type';

export class EventPublisher {
  constructor(private producer: Producer) {}

  publish(event: IEventPublish) {
    this.producer.send({
      topic: event.topic,
      messages: [{ key: event.key, value: event.data }],
    });
  }
}
