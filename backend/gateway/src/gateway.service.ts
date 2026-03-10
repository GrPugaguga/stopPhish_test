import { Service, ServiceBroker } from 'moleculer';
import type { IncomingMessage, ServerResponse } from 'http';
import ApiGateway from 'moleculer-web';
import { createAuthMiddleware } from './middleware';
import { ENV } from '@shared/config';

export default class GatewayService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);
    this.parseServiceSchema({
      name: 'gateway',
      mixins: [ApiGateway],
      settings: {
        port: ENV.GATEWAY_PORT,
        onError(_req: IncomingMessage, res: ServerResponse, err: Record<string, unknown>) {
          const status = (err.code as number) || 500;
          res.writeHead(status, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              message: (err.message as string) || 'Internal server error',
              code: (err.type as string) || 'UNKNOWN_ERROR',
            }),
          );
        },
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
            use: [createAuthMiddleware(broker)],
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
