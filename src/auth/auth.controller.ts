import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body(ValidationPipe) registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post("login")
  login(@Body(ValidationPipe) loginAuthDto: LoginAuthDto) {
    console.log("chegou aqui");
    return this.authService.login(loginAuthDto);
  }
}
