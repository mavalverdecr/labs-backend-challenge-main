import { KafkaMessage } from 'kafkajs';

export type MessageValue = {
  specversion: string;
  id: string;
  source: string;
  type: string;
  datacontenttype: string;
  data: unknown;
};

export abstract class ConsumerBase {
  public abstract topic: string;
  async _execute({ topic, message }: { topic: string; message: KafkaMessage }) {
    try {
      // A bit more of error handlind in order to acomplish with the types
      if (!message || !message.value) {
        throw new Error(`Message on topic ${topic} is required`);
      }
      const parsedMessage: MessageValue = JSON.parse(Buffer.from(message.value).toString('utf-8'));
      if (!parsedMessage.data) {
        throw new Error(`Message data on topic ${topic} is required`);
      }
      await this.execute(parsedMessage.data);
      console.log(`Message processed on topic ${topic} - ${JSON.stringify(parsedMessage.data)}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: any) {
    console.error('Queue server error', error);
    // TODO: After failed all the retries, send to dead letter queue
  }

  abstract execute(message: unknown): Promise<void>;
}
