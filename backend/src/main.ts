import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const configuredOrigins = config.get<string>(
    'CORS_ORIGIN',
    'http://localhost:3000,http://127.0.0.1:3000',
  );
  const origins = configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins.includes('*') ? true : origins,
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  const port = Number(config.get<string>('PORT', '3000'));
  await app.listen(port, '0.0.0.0');
  console.log(`API «Умное расписание» слушает 0.0.0.0:${port}/api`);
}

void bootstrap();
