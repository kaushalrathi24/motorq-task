import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApproverService {
  constructor(private readonly prisma: PrismaService) {}

  async getRequests(approverId: string) {
    const workflows = await this.prisma.workflow.findMany({
      select: {
        id: true,
      },
      where: {
        approvers: {
          some: {
            id: approverId,
          },
        },
      },
    });
    return workflows;
  }
}
