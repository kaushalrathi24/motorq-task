import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowDto } from './dto/createWorkflow.dto';
import { Status, Type } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getApprovers() {
    try {
      const approvers = await this.prisma.approver.findMany({
        select: { id: true, User: { select: { name: true } } },
      });

      return approvers;
    } catch (error) {
      return error;
    }
  }

  async createWorkflow(createWorkflowDto: CreateWorkflowDto) {
    try {
      const { name, description, type, approvers } = createWorkflowDto;
      const approversList = approvers.map((approver) => ({
        id: approver,
      }));
      const typeEnum: Type = Type[type];

      await this.prisma.workflow.create({
        data: {
          name,
          description,
          type: typeEnum,
          approvers: {
            connect: approversList,
          },
        },
      });

      return { status: 'Successfully created' };
    } catch (error) {
      return error;
    }
  }

  async getWorkflows() {
    try {
      const workflows = await this.prisma.workflow.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      return workflows;
    } catch (error) {
      return error;
    }
  }

  async getPendingCount(workflowId: string) {
    const count = await this.prisma.request.count({
      where: {
        Workflow: {
          id: workflowId,
        },
        status: 'PENDING',
      },
    });
    return { count };
  }

  async getCount(workflowId: string, statusString: string) {
    const now = new Date();
    const res = {};
    const status: Status = Status[statusString];

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    res['month'] = await this.getCountTemplate(
      workflowId,
      startOfMonth,
      endOfMonth,
      status,
    );

    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - dayOfWeek,
    );
    const endOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - dayOfWeek + 6,
      23,
      59,
      59,
      999,
    );
    res['week'] = await this.getCountTemplate(
      workflowId,
      startOfWeek,
      endOfWeek,
      status,
    );

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );
    res['day'] = await this.getCountTemplate(
      workflowId,
      startOfDay,
      endOfDay,
      status,
    );

    return res;
  }

  async getCountTemplate(
    workflowId: string,
    gte: Date,
    lte: Date,
    status: Status,
  ) {
    const count = await this.prisma.request.count({
      where: {
        Workflow: {
          id: workflowId,
        },
        status,
        updatedAt: {
          gte,
          lte,
        },
      },
    });
    return { count };
  }
}
