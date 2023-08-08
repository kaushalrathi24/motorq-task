import { Controller, UseGuards, SetMetadata, Get } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { ApproverService } from './approver.service';
import { User } from 'src/auth/auth.decorator';
import { UserInterface } from 'src/auth/interface/user.interface';

@UseGuards(JwtGuard, RolesGuard)
@Controller('approver')
export class ApproverController {
  constructor(private readonly approverService: ApproverService) {}

  @SetMetadata('role', 'APPROVER')
  @Get('get-requests')
  async getRequests(@User() user: UserInterface) {
    return await this.approverService.getRequests(user.id);
  }
}
