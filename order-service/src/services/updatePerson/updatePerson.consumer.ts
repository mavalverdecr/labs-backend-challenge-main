import { Topic } from '../../infrastructure/queueServer';
import { ConsumerBase } from '../../infrastructure/queueServer/consumerBase';
import { UpdatePersonDTO } from './interface';
import { UpdatePersonUseCase, updatePersonUseCase } from './updatePersons.useCase';

export class UpdatePersonController extends ConsumerBase {
  public topic = Topic.PERSON_EVENTS_CHANGED;

  constructor(private updatePersonUseCase: UpdatePersonUseCase) {
    super();
  }

  async execute(message: UpdatePersonDTO) {
    return this.updatePersonUseCase.execute(message.personid);
  }
}

export const updatePersonController = new UpdatePersonController(updatePersonUseCase);
