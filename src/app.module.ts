import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthorizedPersonModule } from './authorized-person/authorized-person.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsRecognitionModule } from './aws-recognition/aws-recognition.module';
import { ChildModule } from './child/child.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        logging: true,
        autoLoadEntities: true,
        synchronize: true,
        cache: false
      }),
    }),
    AuthorizedPersonModule,
    AwsRecognitionModule,
    ChildModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
