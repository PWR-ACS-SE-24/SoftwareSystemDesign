import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter, InternalExceptionFilter } from './shared/api/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new InternalExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Leprechaun API')
    .setDescription('API for the Leprechaun service')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/int/v1/docs/swagger', app, documentFactory, {
    jsonDocumentUrl: '/int/v1/docs/openapi.json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
