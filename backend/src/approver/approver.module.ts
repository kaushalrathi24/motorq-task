import { Module } from '@nestjs/common';
import { ApproverService } from './approver.service';
import { ApproverController } from './approver.controller';

@Module({
  providers: [ApproverService],
  controllers: [ApproverController],
})
export class ApproverModule {}
