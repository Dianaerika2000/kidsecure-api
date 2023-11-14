import { Module } from '@nestjs/common';
import { FatherService } from './father.service';
import { FatherController } from './father.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Father } from './entities/father.entity';
import { AwsRecognitionModule } from 'src/aws-recognition/aws-recognition.module';

@Module({
  controllers: [FatherController],
  providers: [FatherService],
  imports: [
    TypeOrmModule.forFeature([ Father ]),
    AwsRecognitionModule,
  ],
  exports: [
    FatherService,
  ]
})
export class FatherModule {}
