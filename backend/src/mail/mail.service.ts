import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRequestersStatus(
    email: string,
    requesterName: string,
    requestName: string,
    requestStatus: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Request Status Updates',
      template: './requestUpdate',
      context: {
        requestName,
        requestStatus,
        requesterName,
      },
    });
  }
}
