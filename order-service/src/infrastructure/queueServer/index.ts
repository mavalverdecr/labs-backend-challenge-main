import { Kafka } from 'kafkajs';
import { ENV, getEnv } from '../../shared/env';
import { ConsumerBase } from './consumerBase';
import { Database } from '../database/interface';

export enum Topic {
  PERSON_EVENTS_CHANGED = 'personevents-changed',
  PERSON_EVENTS_DELETED = 'personevents-deleted',
}

export class QueueListener {
  private kafka: Kafka;

  constructor(private consumers: ConsumerBase[], private database: Database) {
    this.kafka = new Kafka({
      clientId: getEnv(ENV.KAFKA_CLIENT_ID),
      brokers: [getEnv(ENV.KAFKA_BROKERS)],
    });
  }

  async run() {
    const consumer = this.kafka.consumer({ groupId: getEnv(ENV.KAFKA_GROUP_ID) });
    await consumer.connect();
    await this.database.connect();
    for (const topic of Object.values(Topic)) {
      await consumer.subscribe({ topic });
    }
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const consumer = this.consumers.find((consumer) => consumer.topic === topic);
        if (!consumer) {
          throw new Error(`Consumer for topic ${topic} not found`);
        }
        // TODO: In case of multiple consumers listen for the same topic,
        // we will need to execute them in parallel
        await consumer._execute({ topic, message });
      },
    });
  }
}
