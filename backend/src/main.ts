import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.enableCors({
    origin: 'http://localhost:61707',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  app.enableCors({
    origin: 'http://kkt.masterminutka.ru',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  app.enableCors({
    origin: 'http://192.168.1.3:61707',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 61708);
}
bootstrap();
