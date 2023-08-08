import { Body, Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    async login(@Body() loginDto: LoginDto) {
        
    }
}
