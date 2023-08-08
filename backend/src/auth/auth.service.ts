import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, role: true, password: true },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = { id: user.id, role: user.role };
      const token = this.jwtService.sign(payload, {
        expiresIn: await this.configService.get('ACCESS_TOKEN_EXPIRY'),
        secret: await this.configService.get('ACCESS_TOKEN_SECRET'),
      });
      return { token, role: user.role };
    } catch (error) {
      return error;
    }
  }
}
