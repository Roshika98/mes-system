import { Admin, Kafka, Producer, logLevel } from 'kafkajs';

export class EventBus {
  private static instance: EventBus;

  public static CreateEventBus(clientName: string) {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(clientName);
    }
    return EventBus.instance;
  }

  public get Producer(): Producer {
    if (!this.producer) {
      throw new Error('Producer not initialized');
    }
    return this.producer;
  }

  private kafkaInstance: Kafka;
  private producer: Producer;
  private admin: Admin;

  private constructor(private clientName: string) {
    const kafkaBroker = process.env['KAFKA_BROKERS'] ?? 'localhost:9092';
    this.kafkaInstance = new Kafka({
      clientId: this.clientName,
      brokers: [kafkaBroker],
      logLevel: logLevel.NOTHING,
    });
    this.admin = this.kafkaInstance.admin();
    this.producer = this.kafkaInstance.producer();
  }

  async *checkForTopics() {
    while (true) {
      try {
        await this.admin.connect();
        const metadata = await this.admin.fetchTopicMetadata();
        yield metadata;
        if (metadata.topics.length > 0) {
          await this.admin.disconnect();
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.info('waiting for broker...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
