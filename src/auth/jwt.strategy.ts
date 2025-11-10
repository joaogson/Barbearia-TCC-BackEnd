import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // IMPORTANTE: Use a mesma 'secret' que você define no AuthModule
      secretOrKey: process.env.JWT_SECRET || 'password',
    });
  }

  /**
   * O Passport valida o token automaticamente.
   * Este método só é chamado se o token for VÁLIDO.
   * O que retornamos aqui é anexado ao `request.user`.
   */
  async validate(payload: any) {
    // payload é o JSON que colocamos dentro do JWT no login
    // { sub: 'user-id', role: 'BARBER' }
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException();
    }
    console.log(payload.sub);
    return { userId: payload.sub, role: payload.role }; // <- Isso se torna request.user
  }
}
