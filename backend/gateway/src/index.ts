import { ServiceBroker } from 'moleculer';
import { ENV } from '@shared/config';
import GatewayService from './gateway.service.js';

const broker = new ServiceBroker({
  nodeID: 'gateway',
  transporter: {
    type: 'NATS',
    options: {
      servers: ENV.NATS_URL,
      user: ENV.NATS_USER,
      pass: ENV.NATS_PASS,
    },
  },
});

broker.createService(GatewayService);

broker.start().catch((err) => {
  console.error('Failed to start gateway:', err);
  process.exit(1);
});
