import { Collection, Document } from 'mongodb';

export interface Database {
  connect(): Promise<void>;
  getCollection<T extends Document>(name: string): Collection<T>;
}
