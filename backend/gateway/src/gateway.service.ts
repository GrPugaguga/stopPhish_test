import { Service, ServiceBroker } from 'moleculer';
import ApiGateway from 'moleculer-web';
import { createAuthMiddleware } from './middleware';

export default class GatewayService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);
    this.parseServiceSchema({
      name: 'gateway',
      mixins: [ApiGateway],
      settings: {
        port: 3000,
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
            },
            bodyParsers: { json: true },
          },
        ],
      },
    });
  }
}
