import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { RequesterModule } from './requester/requester.module';
import { ApproverModule } from './approver/approver.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: '../../.env',
    }),
    AuthModule,
    PrismaModule,
    AdminModule,
    RequesterModule,
    ApproverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
