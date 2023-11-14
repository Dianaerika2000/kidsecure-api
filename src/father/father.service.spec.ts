import { Test, TestingModule } from '@nestjs/testing';
import { FatherService } from './father.service';

describe('FatherService', () => {
  let service: FatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FatherService],
    }).compile();

    service = module.get<FatherService>(FatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
