import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/createRequest.dto';
import { UserInterface } from '../auth/interface/user.interface';
import { Status } from '@prisma/client';
import { AddJustificationDto } from './dto/addJustification.dto';

@Injectable()
export class RequesterService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkflows() {
    try {
      const workflows = await this.prisma.workflow.findMany({
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      return workflows;
    } catch (error) {
      return error;
    }
  }

  async createRequest(user: UserInterface, createRequestDto: CreateRequestDto) {
    try {
      const { workflowId, name, description, filename } = createRequestDto;

      await this.prisma.request.create({
        data: {
          name,
          description,
          attachmentPath: filename,
          Workflow: {
            connect: {
              id: workflowId,
            },
          },
          Requester: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return { status: 'Successfully created' };
    } catch (error) {
      if (error.code === 'P2025') {
        return { status: 'Error', message: 'Workflow not found' };
      }
      return error;
    }
  }

  async uploadAttachment(filename: string) {
    return { filename };
  }

  async getRequests(user: UserInterface, status: string) {
    const statusEnum: Status = Status[status];
    try {
      const requests = await this.prisma.request.findMany({
        where: {
          Requester: {
            id: user.id,
          },
          status: statusEnum,
        },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          Workflow: {
            select: {
              name: true,
            },
          },
          comments: true,
        },
      });

      return requests;
    } catch (error) {
      return error;
    }
  }

  async addJustification(id: string, addJustificationDto: AddJustificationDto) {
    try {
      const { requestId, description } = addJustificationDto;
      const pendingEnum: Status = Status['PENDING'];
      await this.prisma.request.update({
        where: {
          id: requestId,
          Requester: {
            id,
          },
        },
        data: {
          description,
          status: pendingEnum,
        },
      });

      return { status: 'Successfully added justification' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(
          "Incorrect RequestId or User didn't create request",
        );
      }
      return error;
    }
  }
}
