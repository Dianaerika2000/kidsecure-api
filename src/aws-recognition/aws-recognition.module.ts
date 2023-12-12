import { Module } from '@nestjs/common';
import { AwsRecognitionService } from './aws-recognition.service';
import { AwsRecognitionController } from './aws-recognition.controller';
import { GoogleTranslateModule } from 'src/google-translate/google-translate.module';

@Module({
  imports: [
    GoogleTranslateModule,
  ],
  controllers: [AwsRecognitionController],
  providers: [AwsRecognitionService],
  exports: [AwsRecognitionService],
})
export class AwsRecognitionModule {}
