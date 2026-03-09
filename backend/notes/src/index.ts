import { ServiceBroker } from 'moleculer';
import { ENV } from '@shared/config';
import AppDataSource from './data-source.js';
import NotesService from './notes.service.js';

const broker = new ServiceBroker({
  nodeID: 'notes',
  transporter: {
    type: 'NATS',
    options: {
      servers: ENV.NATS_URL,
      user: ENV.NATS_USER,
      pass: ENV.NATS_PASS,
    },
  },
});

broker.createService(NotesService);

AppDataSource.initialize()
  .then(() => AppDataSource.runMigrations())
  .then(() => broker.start())
  .catch((err) => {
    console.error('Failed to start notes service:', err);
    process.exit(1);
  });
