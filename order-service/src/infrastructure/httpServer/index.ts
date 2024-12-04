import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import { ENV, getEnv } from '../../shared/env';
import { RouterBase } from './routerBase';
import { Database } from '../database/interface';

const assetsPath = path.join(__dirname, '../../../../assets');

const databaseMiddleware = (database: Database) => async (_req: Request, _res: Response, next: NextFunction) => {
  await database.connect();
  next();
};

export class HttpServer {
  private port = getEnv(ENV.HTTP_SERVER_PORT);
  private app = express();

  constructor(private routes: RouterBase[], private database: Database) {
    this.app.use(databaseMiddleware(this.database));
    this.app.use(express.json());

    // I quickly added swagger to the project to see the endpoints in a more friendly way
    const file = fs.readFileSync(path.join(assetsPath, 'order_service_openapi.yaml'), 'utf8');
    const swaggerDocument = YAML.parse(file);
    this.app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Registering the routes
    this.routes.forEach((route) => {
      const { baseUrl, router } = route.getRouter();
      this.app.use(baseUrl, router);
    });
  }

  run() {
    this.app.listen(this.port, () => {
      console.log(`✅ Server is running on port ${this.port}`);
    });
  }
}
