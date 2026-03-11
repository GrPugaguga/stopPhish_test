import { Service, ServiceBroker } from 'moleculer';
import type { IncomingMessage, ServerResponse } from 'http';
import ApiGateway from 'moleculer-web';
import { createAuthMiddleware } from './middleware';
import { ENV } from '@shared/config';

export function onError(_req: IncomingMessage, res: ServerResponse, err: Record<string, unknown>) {
  const statusCode = typeof err.code === 'number' ? err.code : 500;
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      message: (err.message as string) || 'Internal server error',
      code: (err.type as string) || 'UNKNOWN_ERROR',
    }),
  );
}

export default class GatewayService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);
    this.parseServiceSchema({
      name: 'gateway',
      mixins: [ApiGateway],
      settings: {
        port: ENV.GATEWAY_PORT,
        cors: {
          origin: '*',
          methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        },
        onError,
        routes: [
          {
            path: '/auth',
            aliases: {
              'POST /register': 'users.register',
              'POST /login': 'users.login',
            },
            bodyParsers: { json: true },
          },
          {
            path: '/api',
            use: [createAuthMiddleware()],
            aliases: {
              'GET /notes': 'notes.list',
              'POST /notes': 'notes.create',
              'GET /notes/:id': 'notes.get',
              'PUT /notes/:id': 'notes.update',
              'DELETE /notes/:id': 'notes.delete',
              'GET /categories': 'notes.categoriesList',
              'POST /categories': 'notes.categoriesCreate',
              'PUT /categories/:id': 'notes.categoriesUpdate',
              'DELETE /categories/:id': 'notes.categoriesDelete',
            },
            bodyParsers: { json: true },
          },
        ],
      },
    });
  }
}
