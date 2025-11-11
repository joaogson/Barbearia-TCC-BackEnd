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
      sub: user.id, // sub é o padrão do Jwt para o ID
      role: user.role, // role para saber qual camada pode acessar
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    // Encontrar o usuário pelo e-mail
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // ATENÇÃO: Por segurança, não diga "usuário não encontrado".
      // Apenas retorne sucesso para não confirmar se um e-mail existe.
      return { message: "Link enviado casa existe um usuario vinculado a este email!" };
    }

    // Gerar um token secreto e aleatório
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Definir data de expiração
    const expires = new Date(Date.now() + 10 * 60 * 1000); //10 min

    // Salvar o token e a data de expiração no usuário
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpires: expires,
      },
    });

    //Criar o link que vai no e-mail
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Enviar o e-mail
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

  /**
   * Usuário envia a nova senha
   */
  async resetPassword(token: string, newPassword: string) {
    // Encontrar o usuário pelo token e verificar se não expirou
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpires: { gt: new Date() }, // gt = Greater Than (maior que) agora
      },
    });

    // Se o token for inválido ou expirado
    if (!user) {
      throw new BadRequestException("Token inválido ou expirado.");
    }

    // Gerar o hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar o usuário com a nova senha e limpar o token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null, // Limpa o token
        passwordResetTokenExpires: null, // Limpa a expiração
      },
    });

    return { message: "Senha redefinida com sucesso!" };
  }
}
