import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthorizedPersonModule } from './authorized-person/authorized-person.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsRecognitionModule } from './aws-recognition/aws-recognition.module';
import { ChildModule } from './child/child.module';
import { PersonModule } from './person/person.module';
import { FatherModule } from './father/father.module';
import { ClassroomModule } from './classroom/classroom.module';
import { CommonModule } from './common/common.module';
import { GoogleTranslateModule } from './google-translate/google-translate.module';
import { NotificationModule } from './notification/notification.module';
import { OutpuControlModule } from './outpu-control/outpu-control.module';

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
        url: configService.get('DB_URL'),
        entities: ['dist/src/**/*.entity{.ts,.js}'],
        logging: true,
        autoLoadEntities: true,
        synchronize: true,
        cache: false,
        ssl: true,
      }),
    }),
    AuthorizedPersonModule,
    AwsRecognitionModule,
    ChildModule,
    FatherModule,
    PersonModule,
    ClassroomModule,
    CommonModule,
    GoogleTranslateModule,
    NotificationModule,
    OutpuControlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
