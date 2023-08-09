import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApproverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailService,
  ) {}

  async getRequests(userId: string) {
    const { id: approverId } = await this.prisma.approver.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!approverId) {
      throw new ForbiddenException('Incorrect User Id');
    }
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
        status: 'PENDING',
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
        status: true,
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
        attachmentPath: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
  }

  async approveRequest(userId: string, id: string, comments: string) {
    const { id: approverId } = await this.prisma.approver.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!approverId) {
      throw new ForbiddenException('Incorrect User id');
    }

    const { Approvers, status, Workflow, Requester, name } =
      await this.prisma.request.findUnique({
        where: {
          id,
        },
        include: {
          Approvers: {
            select: {
              id: true,
            },
          },
          Workflow: {
            select: {
              type: true,
              id: true,
            },
          },
          Requester: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

    if (status != 'PENDING') {
      return {
        status: 'Request not in PENDING',
        message: `Request in ${status}`,
      };
    }
    let numApprovals = 0;
    if (Approvers != null && Approvers.length != 0) {
      numApprovals = Approvers.length;
      const alreadyApproverList = <[string]>(
        Approvers.flatMap((request) => Object.values(request))
      );
      if (alreadyApproverList.includes(approverId)) {
        throw new BadRequestException('You have already approved this request');
      }
    }

    let newStatus = 'PENDING';

    const approvers = await this.prisma.workflow.findUnique({
      where: {
        id: Workflow.id,
      },
      select: {
        approvers: {
          select: {
            id: true,
          },
        },
      },
    });

    const approversList = <[string]>(
      approvers.approvers.flatMap((request) => Object.values(request))
    );

    if (!approversList.includes(approverId)) {
      throw new ForbiddenException('You are not an approver for this workflow');
    }

    if (Workflow.type == 'SINGLE') {
      newStatus = 'APPROVED';
    } else if (Workflow.type == 'TWO') {
      if (numApprovals == 1) {
        newStatus = 'APPROVED';
      }
    } else {
      if (numApprovals == approvers.approvers.length - 1) {
        newStatus = 'APPROVED';
      }
    }

    Approvers.push({ id: approverId });
    const newStatusEnum: Status = Status[newStatus];

    await this.prisma.request.update({
      where: {
        id,
      },
      data: {
        status: newStatusEnum,
        Approvers: {
          connect: Approvers,
        },
        comments,
      },
    });

    await this.mailer.sendRequestersStatus(
      Requester.email,
      Requester.name,
      name,
      newStatus,
    );

    return { newStatus };
  }

  async rejectOrJustifyRequest(
    userId: string,
    id: string,
    comments: string,
    type: string,
  ) {
    const { id: approverId } = await this.prisma.approver.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!approverId) {
      throw new ForbiddenException('Incorrect User Id');
    }

    const { Approvers, status, Workflow, Requester, name } =
      await this.prisma.request.findUnique({
        where: {
          id,
        },
        include: {
          Approvers: {
            select: {
              id: true,
            },
          },
          Workflow: {
            select: {
              id: true,
            },
          },
          Requester: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

    if (Approvers != null && Approvers.length != 0) {
      const alreadyApproverList = <[string]>(
        Approvers.flatMap((request) => Object.values(request))
      );
      if (alreadyApproverList.includes(approverId)) {
        throw new BadRequestException('You have already approved this request');
      }
    }

    if (status != 'PENDING') {
      return {
        status: 'Request not in PENDING',
        message: `Request in ${status}`,
      };
    }

    const approvers = await this.prisma.workflow.findUnique({
      where: {
        id: Workflow.id,
      },
      select: {
        approvers: {
          select: {
            id: true,
          },
        },
      },
    });

    const approversList = <[string]>(
      approvers.approvers.flatMap((request) => Object.values(request))
    );

    if (!approversList.includes(approverId)) {
      throw new ForbiddenException('You are not an approver for this workflow');
    }

    const newStatusEnum: Status = Status[type];

    await this.prisma.request.update({
      where: {
        id,
      },
      data: {
        status: newStatusEnum,
        comments,
      },
    });

    await this.mailer.sendRequestersStatus(
      Requester.email,
      Requester.name,
      name,
      type,
    );

    return { newStatusEnum };
  }
}
