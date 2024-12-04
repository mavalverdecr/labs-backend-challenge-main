import { orderMongoRepository, OrderRepository } from '../../repositories/OrderMongoRepository';

export class DeleteOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(personId: string): Promise<void> {
    // Unset person from orders
    await this.orderRepository.deleteOrders({ personId });

    // In order to simplify the approach, I delete all the orders where the person was involved.
    // Another approach could be to delete the person from the orders and keep them
    // until no person is associated to. At this point, the order will be deleted.
  }
}

export const deleteOrdersUseCase = new DeleteOrdersUseCase(orderMongoRepository);
