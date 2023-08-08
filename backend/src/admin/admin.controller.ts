import {
  Body,
  Controller,
  Get,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { CreateWorkflowDto } from './dto/createWorkflow.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @SetMetadata('role', 'ADMIN')
  @Get('get-approvers')
  async getApprovers() {
    return await this.adminService.getApprovers();
  }

  @SetMetadata('role', 'ADMIN')
  @Post('create-workflow')
  async createWorkflow(@Body() createWorkflowDto: CreateWorkflowDto) {
    return await this.adminService.createWorkflow(createWorkflowDto);
  }
}
