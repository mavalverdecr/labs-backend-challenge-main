import { Document, MongoClient } from 'mongodb';
import { ENV, getEnv } from '../../shared/env';
import { Database } from './interface';

class MongoDatabase implements Database {
  private dbName = getEnv(ENV.DB_NAME);
  private uri = getEnv(ENV.MONGO_URI);

  constructor() {
    this.client.on('connectionCreated', () => {
      console.log('✅ Database connected');
    });
  }

  get client(): MongoClient {
    return new MongoClient(this.uri, { timeoutMS: 10000 });
  }

  async connect() {
    await this.client.connect();
  }

  getCollection<T extends Document>(name: string) {
    return this.client.db(this.dbName).collection<T>(name);
  }
}

export const database = new MongoDatabase();
