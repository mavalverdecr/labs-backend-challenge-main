import { HttpServer } from './infrastructure/httpServer';
import { QueueListener } from './infrastructure/queueServer';
import * as routes from './infrastructure/httpServer/routes';
import * as consumers from './infrastructure/queueServer/consumers';
import { database } from './infrastructure/database';

const httpServer = new HttpServer(Object.values(routes), database);
const queueListener = new QueueListener(Object.values(consumers), database);

httpServer.run();
queueListener.run().then(() => {
  console.log('✅ Queue listener is running');
});
