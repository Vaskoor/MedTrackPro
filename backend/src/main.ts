import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(helmet());
  app.use(compression());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
  app.enableCors({ origin: configService.get('FRONTEND_URL') });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(4000);
  console.log('Backend running on port 4000');
}
bootstrap();
