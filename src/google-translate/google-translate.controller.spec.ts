import { Test, TestingModule } from '@nestjs/testing';
import { GoogleTranslateController } from './google-translate.controller';
import { GoogleTranslateService } from './google-translate.service';

describe('GoogleTranslateController', () => {
  let controller: GoogleTranslateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleTranslateController],
      providers: [GoogleTranslateService],
    }).compile();

    controller = module.get<GoogleTranslateController>(GoogleTranslateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
