import { Request, Response } from 'express';
import { HTTP_METHOD, HTTP_STATUS_CODE } from '../../shared/constants';
import { UseCaseError } from '../../shared/errors';

export abstract class ControllerBase {
  public abstract path: string;
  public abstract method: HTTP_METHOD;

  async _execute(request: Request, response: Response) {
    try {
      await this.execute(request, response);
      console.log('Request processed successfully');
    } catch (error) {
      this.handleError(error, response);
    }
  }

  private handleError(error: any, response: Response) {
    console.error('Server error', error);
    if (error instanceof UseCaseError) {
      const { statusCode, message } = error.parseToJson();
      response.status(statusCode).send({ message });
      return;
    }
    response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal server error', errorMessage: error?.message });
    return;
  }

  protected abstract execute(request: Request, response: Response): Promise<void>;
}
