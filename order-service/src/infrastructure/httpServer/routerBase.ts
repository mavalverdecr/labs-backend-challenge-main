import { Router } from 'express';
import { ControllerBase } from './controllerBase';

export class RouterBase {
  protected router = Router();

  constructor(public baseUrl: string, readonly controllers: ControllerBase[]) {
    this.controllers.forEach((controller) => {
      console.log(`🚀 Registering route ${controller.method} ${this.baseUrl}${controller.path}`);
      this.router[controller.method](controller.path, controller._execute.bind(controller));
    });
  }

  public getRouter() {
    return { baseUrl: this.baseUrl, router: this.router };
  }
}
