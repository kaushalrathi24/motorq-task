import {
  Controller,
  Get,
  Post,
  SetMetadata,
  UseGuards,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { RequesterService } from './requester.service';
import { User } from '../auth/auth.decorator';
import { UserInterface } from 'src/auth/interface/user.interface';
import { CreateRequestDto } from './dto/createRequest.dto';
import { AddJustificationDto } from './dto/addJustification.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@UseGuards(JwtGuard, RolesGuard)
@Controller('requester')
export class RequesterController {
  constructor(private readonly requesterService: RequesterService) {}

  @SetMetadata('role', 'REQUESTER')
  @Get('get-workflows')
  async getWorkflows() {
    return await this.requesterService.getWorkflows();
  }

  @SetMetadata('role', 'REQUESTER')
  @Post('create-request')
  async createRequest(
    @User() user: UserInterface,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return await this.requesterService.createRequest(user, createRequestDto);
  }

  @SetMetadata('role', 'REQUESTER')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const uniqueId = uuidv4();
          const extension = extname(file.originalname);
          const fileName = `${file.originalname}_${uniqueId}${extension}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadAttachment(
    @User() user: UserInterface,
    @Body() createRequestDto: CreateRequestDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'pdf',
        })
        .addMaxSizeValidator({
          maxSize: 500000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.requesterService.uploadAttachment(file.filename);
  }

  @SetMetadata('role', 'REQUESTER')
  @Get('get-pending')
  async getPending(@User() user: UserInterface) {
    return await this.requesterService.getRequests(user, 'PENDING');
  }

  @SetMetadata('role', 'REQUESTER')
  @Get('get-approved')
  async getApproved(@User() user: UserInterface) {
    return await this.requesterService.getRequests(user, 'APPROVED');
  }

  @SetMetadata('role', 'REQUESTER')
  @Get('get-rejected')
  async getRejected(@User() user: UserInterface) {
    return await this.requesterService.getRequests(user, 'REJECTED');
  }

  @SetMetadata('role', 'REQUESTER')
  @Get('get-justified')
  async getJustified(@User() user: UserInterface) {
    return await this.requesterService.getRequests(user, 'JUSTIFICATION');
  }

  @SetMetadata('role', 'REQUESTER')
  @Post('add-justification')
  async addJustification(
    @User() user: UserInterface,
    @Body() addJustificationDto: AddJustificationDto,
  ) {
    return await this.requesterService.addJustification(
      user.id,
      addJustificationDto,
    );
  }
}
