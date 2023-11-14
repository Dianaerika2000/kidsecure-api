import { Test, TestingModule } from '@nestjs/testing';
import { FatherController } from './father.controller';
import { FatherService } from './father.service';

describe('FatherController', () => {
  let controller: FatherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FatherController],
      providers: [FatherService],
    }).compile();

    controller = module.get<FatherController>(FatherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
