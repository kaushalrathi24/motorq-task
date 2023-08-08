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
}
