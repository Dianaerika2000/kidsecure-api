import { Module } from '@nestjs/common';
import { AwsRecognitionService } from './aws-recognition.service';
import { AwsRecognitionController } from './aws-recognition.controller';

@Module({
  controllers: [AwsRecognitionController],
  providers: [AwsRecognitionService],
  exports: [AwsRecognitionService],
})
export class AwsRecognitionModule {}
