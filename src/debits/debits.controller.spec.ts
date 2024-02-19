import { Test, TestingModule } from '@nestjs/testing';
import { DebitsController } from './debits.controller';
import { DebitsService } from './debits.service';

describe('DebitsController', () => {
  let controller: DebitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebitsController],
      providers: [DebitsService],
    }).compile();

    controller = module.get<DebitsController>(DebitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
