import { Request, Response } from 'express';
import { createOrderUseCase, CreateOrderUseCase } from './create.useCase';
import { InputOrderDTO, OutputOrderDTO } from './interface';
import { HTTP_METHOD, HTTP_STATUS_CODE } from '../../shared/constants';
import { ControllerBase } from '../../infrastructure/httpServer/controllerBase';

export class CreateOrderController extends ControllerBase {
  public path = '/';
  public method = HTTP_METHOD.POST;

  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {
    super();
  }

  async execute(request: Request<{}, {}, InputOrderDTO>, response: Response<OutputOrderDTO>) {
    const order = request.body;
    const createdOrder = await this.createOrderUseCase.execute(order);
    response.status(HTTP_STATUS_CODE.CREATED).send({ orderID: createdOrder.orderID });
  }
}

export const createOrderController = new CreateOrderController(createOrderUseCase);
