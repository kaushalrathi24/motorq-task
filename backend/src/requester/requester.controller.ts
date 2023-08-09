import {
  Controller,
  Get,
  Post,
  SetMetadata,
  UseGuards,
  Body,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { RequesterService } from './requester.service';
import { User } from '../auth/auth.decorator';
import { UserInterface } from 'src/auth/interface/user.interface';
import { CreateRequestDto } from './dto/createRequest.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('requester')
export class RequesterController {
  constructor(private readonly requesterService: RequesterService) {}

  @SetMetadata('role', 'REQUESTER')
  @Get('get-workflows')
  async getWorkflows() {
    return await this.requesterService.getWorkflows();
  }

  @SetMetadata('role', 'REQUESTER')
  @Post('create-request')
  async createRequest(
    @User() user: UserInterface,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return await this.requesterService.createRequest(user, createRequestDto);
  }

  @SetMetadata('role', 'REQUESTER')
  @Get('get-pending')
  async getPending(@User() user: UserInterface) {
    return await this.requesterService.getRequests(user, 'PENDING');
  }

  @SetMetadata('role', 'REQUESTER')
  @Get('get-approved')
  async getApproved(@User() user: UserInterface) {
    return await this.requesterService.getRequests(user, 'APPROVED');
  }

  @SetMetadata('role', 'REQUESTER')
  @Get('get-rejected')
  async getRejected(@User() user: UserInterface) {
    return await this.requesterService.getRequests(user, 'REJECTED');
  }

  @SetMetadata('role', 'REQUESTER')
  @Get('get-justified')
  async getJustified(@User() user: UserInterface) {
    return await this.requesterService.getRequests(user, 'JUSTIFICATION');
  }
}
