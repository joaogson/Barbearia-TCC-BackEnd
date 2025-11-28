import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto"; // Módulo nativo do Node.js
import * as bcrypt from "bcrypt";
import { Role } from "generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "@nestjs-modules/mailer";
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
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
      sub: user.id,
      role: user.role, // role para saber qual camada pode acessar
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: "Link enviado casa existe um usuario vinculado a este email!" };
    }
    const resetToken = crypto.randomBytes(32).toString("hex");

    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpires: expires,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Recuperação de Senha - Barbearia TCC",
      html: `
        <p>Olá, ${user.name}!</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}" target="_blank">Redefinir Minha Senha</a>
        <p>Este link expira em 10 minutos.</p>
        <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
      `,
    });

    return { message: "Link de redefinição enviado para o e-mail." };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException("Token inválido ou expirado.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpires: null,
      },
    });

    return { message: "Senha redefinida com sucesso!" };
  }
}
