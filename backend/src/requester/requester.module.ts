import { Module } from '@nestjs/common';
import { RequesterService } from './requester.service';

@Module({
  providers: [RequesterService]
})
export class RequesterModule {}
