import {
  Body,
  Controller,
  Get,
  Param,
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

  @SetMetadata('role', 'ADMIN')
  @Get('get-workflows')
  async getWorkflows() {
    return await this.adminService.getWorkflows();
  }

  @SetMetadata('role', 'ADMIN')
  @Get('get-pending-count/:id')
  async getPendingCount(@Param('id') id: string) {
    return await this.adminService.getPendingCount(id);
  }

  @SetMetadata('role', 'ADMIN')
  @Get('get-approved-count/:id')
  async getApprovedCount(@Param('id') id: string) {
    return await this.adminService.getCount(id, 'APPROVED');
  }

  @SetMetadata('role', 'ADMIN')
  @Get('get-rejected-count/:id')
  async getRejectedCount(@Param('id') id: string) {
    return await this.adminService.getCount(id, 'REJECTED');
  }

  @SetMetadata('role', 'ADMIN')
  @Get('get-history')
  async getHistory() {
    return await this.adminService.getHistory();
  }
}
