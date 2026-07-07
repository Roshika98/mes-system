import { Admin, Kafka, Producer } from 'kafkajs';

class MessageBus {
  private static instance: MessageBus;

  public static CreateMessageBus(clientName: string) {
    if (!MessageBus.instance) {
      MessageBus.instance = new MessageBus(clientName);
    }
    return MessageBus.instance;
  }

  private kafkaInstance: Kafka;
  private producer: Producer;
  private admin: Admin;

  private constructor(private clientName: string) {
    const kafkaBroker = process.env['KAFKA_BROKERS'] ?? 'localhost:9092';
    this.kafkaInstance = new Kafka({
      clientId: this.clientName,
      brokers: [kafkaBroker],
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
      } catch (error) {
        console.log(error);
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

export default MessageBus;
