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
      secretOrKey: 'SUPER_SECRET_KEY_2026', // LA MISMA QUE EN EL MODULE
    });
  }

  async validate(payload: any) {
    // Si el token es válido, Passport nos da los datos del "payload"
    return { userId: payload.sub, username: payload.user };
  }
}
