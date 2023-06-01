import { NestFactory } from '@nestjs/core';
import { ImagesModule } from './images.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ImagesModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RMQ_USER}:${process.env.RMQ_USER}@${process.env.RMQ_HOST}`],
      queue: process.env.RMQ_QUEUE_IMAGES,
      queueOptions: {
        durable: true,
      },
    },

  });
  
  app.listen();
}
bootstrap();
