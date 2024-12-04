import { randomUUID } from 'crypto';
import { Order } from '../../models/order';
import { UseCaseError } from '../../shared/errors';
import { InputOrderDTO } from './interface';
import { orderMongoRepository, OrderRepository } from '../../repositories/OrderMongoRepository';
import { HTTP_STATUS_CODE } from '../../shared/constants';
import { contactRepository, ContactRepository } from '../../repositories/ContactRemoteRepository';

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly contactRepository: ContactRepository
  ) {}

  async execute(inputOrder: InputOrderDTO): Promise<Order> {
    const [soldTo, billTo, shipTo] = await Promise.all([
      this.contactRepository.getPerson(inputOrder.soldToID),
      this.contactRepository.getPerson(inputOrder.billToID),
      this.contactRepository.getPerson(inputOrder.shipToID),
    ]);

    if (!soldTo || !billTo || !shipTo) {
      throw new UseCaseError('Person not found', HTTP_STATUS_CODE.NOT_FOUND);
    }
    const order: Order = {
      orderID: randomUUID(),
      orderDate: inputOrder.orderDate,
      soldTo: soldTo,
      billTo: billTo,
      shipTo: shipTo,
      orderValue: inputOrder.orderValue,
      taxValue: inputOrder.taxValue,
      currencyCode: inputOrder.currencyCode,
      items: inputOrder.items,
    };
    await this.orderRepository.createOrder(order);
    return order;
  }
}

export const createOrderUseCase = new CreateOrderUseCase(orderMongoRepository, contactRepository);
