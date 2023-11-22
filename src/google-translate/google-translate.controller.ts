import { Body, Controller, Post } from '@nestjs/common';
import { GoogleTranslateService } from './google-translate.service';

@Controller('google-translate')
export class GoogleTranslateController {
  constructor(private readonly googleTranslateService: GoogleTranslateService) {}

  @Post()
  translateText(@Body() body: any) {
    return this.googleTranslateService.translateText(body.label, 'es');
  }

}
