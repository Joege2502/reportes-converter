import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para que todas las rutas empiecen con /api
  app.setGlobalPrefix('api');

  // Habilitar CORS para que Vercel pueda comunicarse
  app.enableCors();

  // Azure asigna un puerto dinámico, por eso usamos process.env.PORT
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
