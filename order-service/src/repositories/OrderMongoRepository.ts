import { AnyBulkWriteOperation, ObjectId, WithId } from 'mongodb';

import { Order } from '../models/order';
import { Person } from '../models/person';
import { Database } from '../infrastructure/database/interface';
import { database } from '../infrastructure/database';

export interface OrderRepository {
  createOrder(order: Order): Promise<void>;
  updatePersons(person: Person): Promise<void>;
  deleteOrders({ personId }: { personId: string }): Promise<void>;
}

export class OrderMongoRepository implements OrderRepository {
  constructor(private database: Database) {}

  get collection() {
    return this.database.getCollection<Order>('orders');
  }

  async createOrder(order: Order): Promise<void> {
    const result = await this.collection.insertOne(order);
    if (!result.acknowledged) {
      throw new Error('Error creating order');
    }
  }

  async deleteById(id: string): Promise<void> {
    if (!id) {
      throw new Error('Order id is required');
    }
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    if (!result.acknowledged) {
      throw new Error('Error deleting order');
    }
  }

  async getByPersonId(personId: string): Promise<WithId<Order>[]> {
    if (!personId) {
      throw new Error('Person id is required');
    }
    return this.collection
      .find({ $or: [{ 'soldTo.id': personId }, { 'billTo.id': personId }, { 'shipTo.id': personId }] })
      .toArray();
  }

  async updatePersons(person: Person): Promise<void> {
    const bulkOperations: AnyBulkWriteOperation<Order>[] = [
      { updateMany: { filter: { 'soldTo.id': person.id }, update: { $set: { soldTo: person } } } },
      { updateMany: { filter: { 'billTo.id': person.id }, update: { $set: { billTo: person } } } },
      { updateMany: { filter: { 'shipTo.id': person.id }, update: { $set: { shipTo: person } } } },
    ];
    const result = await this.collection.bulkWrite(bulkOperations);
    if (!result.isOk()) {
      throw new Error('Error updating persons');
    }
  }

  async deleteOrders({ personId }: { personId: string }): Promise<void> {
    if (!personId) {
      throw new Error('Person id is required');
    }
    const bulkOperations: AnyBulkWriteOperation<Order>[] = [
      { deleteMany: { filter: { 'soldTo.id': personId } } },
      { deleteMany: { filter: { 'billTo.id': personId } } },
      { deleteMany: { filter: { 'shipTo.id': personId } } },
    ];
    const result = await this.collection.bulkWrite(bulkOperations);
    if (!result.isOk()) {
      throw new Error('Error deleting orders');
    }
  }

  async deleteByIds(ids: string[]): Promise<void> {
    if (!ids.length) {
      throw new Error('Ids are required');
    }
    const result = await this.collection.deleteMany({ _id: { $in: ids.map((id) => new ObjectId(id)) } });
    if (!result.acknowledged) {
      throw new Error('Error deleting orders');
    }
  }
}

export const orderMongoRepository = new OrderMongoRepository(database);
