import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  // Al no poner 'password' dentro de @Body(), recibimos el objeto { username, password }
  async login(@Body() loginDto: any) {
    // Extraemos la password del objeto y se la pasamos al servicio
    return this.authService.login(loginDto.password);
  }
}
