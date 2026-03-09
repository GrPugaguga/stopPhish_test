import { Service, ServiceBroker } from 'moleculer';
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
