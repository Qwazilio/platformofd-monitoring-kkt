import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      process.env.FRONTEND_SERVER_LOCAL,
      process.env.FRONTEND_SERVER,
      process.env.FRONTEND_SERVER_URL,
      process.env.FRONTEND_SERVER_DOCKER,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
