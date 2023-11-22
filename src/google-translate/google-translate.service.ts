import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleTranslateService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async translateText(array: string[], language: string){
    const { Translate } = require('@google-cloud/translate').v2;

    // Instantiates a client
    const translate = new Translate({
      projectId: this.configService.get('GOOGLE_PROJECT_ID'),
      key: this.configService.get('GOOGLE_API_KEY'),
    });

    // The text to translate
    const text = array.toString();
    const [translation] = await translate.translate(text, language);
    return translation.split(',');
  } 

}
