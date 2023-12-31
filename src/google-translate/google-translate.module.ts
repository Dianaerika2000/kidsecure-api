import { Module } from '@nestjs/common';
import { GoogleTranslateService } from './google-translate.service';
import { GoogleTranslateController } from './google-translate.controller';

@Module({
  controllers: [GoogleTranslateController],
  providers: [GoogleTranslateService],
  exports: [GoogleTranslateService],
})
export class GoogleTranslateModule {}
