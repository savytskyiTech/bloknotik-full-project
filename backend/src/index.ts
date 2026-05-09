import { env } from './config/env';
import app from './app';
import pino from 'pino';

const logger = pino({
  name: 'bloknotik-backend',
  transport: env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});

app.listen(env.PORT, () => {
  logger.info(`🚗 Bloknotik Backend running on http://localhost:${env.PORT}`);
  logger.info(`📝 Environment: ${env.NODE_ENV}`);
  logger.info(`🔗 CORS origins: ${env.CORS_ORIGIN.join(', ')}`);
});
