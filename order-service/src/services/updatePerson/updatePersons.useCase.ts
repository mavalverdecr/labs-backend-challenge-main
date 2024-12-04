import { HTTP_STATUS_CODE } from '../../shared/constants';
import { UseCaseError } from '../../shared/errors';
import { orderMongoRepository, OrderRepository } from '../../repositories/OrderMongoRepository';
import { ContactRepository, contactRepository } from '../../repositories/ContactRemoteRepository';

export class UpdatePersonUseCase {
  constructor(private orderRepository: OrderRepository, private contactRepository: ContactRepository) {}

  async execute(personId: string): Promise<void> {
    const updatedPerson = await this.contactRepository.getPerson(personId);
    if (!updatedPerson) {
      throw new UseCaseError('Person not found', HTTP_STATUS_CODE.NOT_FOUND);
    }
    await this.orderRepository.updatePersons(updatedPerson);
  }
}

export const updatePersonUseCase = new UpdatePersonUseCase(orderMongoRepository, contactRepository);
