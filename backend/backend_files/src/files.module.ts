import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';



@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        AWS_REGION: process.env.AWS_REGION,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY:  process.env.AWS_SECRET_ACCESS_KEY,
        AWS_PUBLIC_BUCKET_NAME: process.env.AWS_PUBLIC_BUCKET_NAME
      })
    }),

    ClientsModule.register([
      {
        name: "IMAGES_SERVICE",
        transport: Transport.RMQ,
      }
    ]),
  ],
  controllers: [FilesController],
  providers: [
    FilesService, 
    ConfigService,
    {
      provide: 'IMAGES_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RMQ_USER');
        const password = configService.get('RMQ_PASS');
        const host = configService.get('RMQ_HOST');
        const queueName = configService.get('RMQ_QUEUE_IMAGES');
 
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        })
      },
      
      inject: [ConfigService],
    }
  ],
})
export class FilesModule {}


