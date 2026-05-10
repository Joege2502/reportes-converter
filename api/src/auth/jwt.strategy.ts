import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extraemos el token de la cabecera "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // USAMOS LA VARIABLE DE ENTORNO O LA DE RESPALDO
      secretOrKey: process.env.JWT_SECRET || '12345',
    });
  }

  async validate(payload: any) {
    // Passport inyecta este objeto en request.user
    return { userId: payload.sub, username: payload.user };
  }
}
