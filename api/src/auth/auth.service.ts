import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(password: string) {
    // Traemos el HASH desde el .env
    const adminHash =
      this.configService.get<string>('ADMIN_PASSWORD_HASH') ?? '';

    // Usamos bcrypt para comparar el texto plano del login con el hash del .env
    const isMatch = await bcrypt.compare(password, adminHash);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { role: 'admin', user: 'Roger' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
