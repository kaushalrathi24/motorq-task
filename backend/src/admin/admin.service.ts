import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowDto } from './dto/createWorkflow.dto';
import { Type } from '@prisma/client';

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
}
