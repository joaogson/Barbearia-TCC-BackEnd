import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Role } from "generated/prisma";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterAuthDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) throw new ConflictException("E-mail ja cadastrado");

    return this.userService.create(registerDto, Role.CLIENT);
  }

  async login(loginDto: LoginAuthDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException("Credenciais inválidas");

    const IsPasswordMatching = await bcrypt.compare(loginDto.password, user.password);

    if (!IsPasswordMatching) throw new UnauthorizedException("Senha inválida");

    const payload = {
      sub: user.id, // sub é o padrão do Jwt para o ID
      role: user.role, // role para saber qual camada pode acessar
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
