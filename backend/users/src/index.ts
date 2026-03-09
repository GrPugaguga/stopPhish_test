import { ServiceBroker } from 'moleculer';
import { ENV } from '@shared/config';
import AppDataSource from './data-source.js';
import UsersService from './users.service.js';

const broker = new ServiceBroker({
  nodeID: 'users',
  transporter: {
    type: 'NATS',
    options: {
      servers: ENV.NATS_URL,
      user: ENV.NATS_USER,
      pass: ENV.NATS_PASS,
    },
  },
});

broker.createService(UsersService);

AppDataSource.initialize()
  .then(() => AppDataSource.runMigrations())
  .then(() => broker.start())
  .catch((err) => {
    console.error('Failed to start users service:', err);
    process.exit(1);
  });
