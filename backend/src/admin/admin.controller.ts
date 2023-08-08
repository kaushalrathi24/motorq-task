import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';

@UseGuards(JwtGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @SetMetadata('role', 'ADMIN')
  @Get('get-approvers')
  async getApprovers() {
    return await this.adminService.getApprovers();
  }
}
