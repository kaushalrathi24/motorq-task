import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  getApprovers() {
    try {
      const approvers = this.prisma.approver.findMany({
        select: { id: true, User: { select: { name: true } } },
      });

      return approvers;
    } catch (error) {
      return error;
    }
  }
}
