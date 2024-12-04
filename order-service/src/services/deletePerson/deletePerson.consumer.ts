import { Topic } from '../../infrastructure/queueServer';
import { ConsumerBase } from '../../infrastructure/queueServer/consumerBase';
import { deleteOrdersUseCase, DeleteOrdersUseCase } from './deletePerson.useCase';

export interface DeletePersonDTO {
  personid: string;
}

export class DeletePersonController extends ConsumerBase {
  public topic = Topic.PERSON_EVENTS_DELETED;

  constructor(private deletePersonUseCase: DeleteOrdersUseCase) {
    super();
  }

  async execute(message: DeletePersonDTO) {
    return this.deletePersonUseCase.execute(message.personid);
  }
}

export const deletePersonController = new DeletePersonController(deleteOrdersUseCase);
