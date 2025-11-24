import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { ApiTags } from "@nestjs/swagger";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body(ValidationPipe) registerAuthDto: RegisterAuthDto) {
    console.log("Registro: ", registerAuthDto);
    return this.authService.register(registerAuthDto);
  }

  @Post("login")
  login(@Body(ValidationPipe) loginAuthDto: LoginAuthDto) {
    console.log("chegou aqui");
    return this.authService.login(loginAuthDto);
  }

  @Post("forgot-password")
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    console.log(forgotPasswordDto);
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post("reset-password")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
  }
}
