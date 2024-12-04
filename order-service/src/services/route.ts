import { createOrderController } from './create/create.controller';
import { RouterBase } from '../infrastructure/httpServer/routerBase';

export const orderRouter = new RouterBase('/api/v1/order', [createOrderController]);
