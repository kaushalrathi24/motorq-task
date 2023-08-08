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
    const workflowids = <[string]>(
      workflows.flatMap((request) => Object.values(request))
    );
    const requests = await this.prisma.request.findMany({
      select: {
        id: true,
      },
      where: {
        Workflow: {
          id: {
            in: workflowids,
          },
        },
      },
    });
    const requestIds = <[string]>(
      requests.flatMap((request) => Object.values(request))
    );
    return await this.prisma.request.findMany({
      where: {
        id: {
          in: requestIds,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        Requester: {
          select: {
            name: true,
          },
        },
        Workflow: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
  }
}
