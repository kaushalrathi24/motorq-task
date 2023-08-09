import {
  Controller,
  UseGuards,
  SetMetadata,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { ApproverService } from './approver.service';
import { User } from 'src/auth/auth.decorator';
import { UserInterface } from 'src/auth/interface/user.interface';
import { ApproveRequestDto } from './dto/approveRequest.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('approver')
export class ApproverController {
  constructor(private readonly approverService: ApproverService) {}

  @SetMetadata('role', 'APPROVER')
  @Get('get-requests')
  async getRequests(@User() user: UserInterface) {
    return await this.approverService.getRequests(user.id);
  }

  @SetMetadata('role', 'APPROVER')
  @Post('approve-request')
  async approveRequest(
    @User() user: UserInterface,
    @Body() approveRequestDto: ApproveRequestDto,
  ) {
    return await this.approverService.approveRequest(
      user.id,
      approveRequestDto.requestId,
      approveRequestDto.comment,
    );
  }

  @SetMetadata('role', 'APPROVER')
  @Post('reject-request')
  async rejectRequest(
    @User() user: UserInterface,
    @Body() approveRequestDto: ApproveRequestDto,
  ) {
    return await this.approverService.rejectOrJustifyRequest(
      user.id,
      approveRequestDto.requestId,
      approveRequestDto.comment,
      'REJECTED',
    );
  }

  @SetMetadata('role', 'APPROVER')
  @Post('justify-request')
  async justifyRequest(
    @User() user: UserInterface,
    @Body() approveRequestDto: ApproveRequestDto,
  ) {
    return await this.approverService.rejectOrJustifyRequest(
      user.id,
      approveRequestDto.requestId,
      approveRequestDto.comment,
      'JUSTIFICATION',
    );
  }
}
