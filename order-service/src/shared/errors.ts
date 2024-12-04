import { HTTP_STATUS_CODE } from './constants';

export class UseCaseError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
  }

  parseToJson() {
    return {
      message: this.message,
      statusCode: this.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
    };
  }
}
