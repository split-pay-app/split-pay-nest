import { Test, TestingModule } from '@nestjs/testing';
import { DebitsService } from './debits.service';

describe('DebitsService', () => {
  let service: DebitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebitsService],
    }).compile();

    service = module.get<DebitsService>(DebitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
