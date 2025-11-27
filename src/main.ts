import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      // "http://localhost:3000", // Se o seu frontend Next.js rodar na porta 3000
      "http://localhost:3001",
      // "http://localhost:3002",
      // "https://barbearia-tcc-frontend.onrender.com",
      "http://192.168.1.76:3001",
      "app://localhost",
      "null",
    ], // A URL do seu front (Vercel)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
