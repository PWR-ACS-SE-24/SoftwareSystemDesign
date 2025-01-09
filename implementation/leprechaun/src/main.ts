import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AccidentModule } from './accident/accident.module';
import { AppModule } from './app.module';
import config from './config/config';
import { InternalModule } from './internal/internal.module';
import { LineModule } from './line/line.module';
import { RouteModule } from './route/route.module';
import { HttpExceptionFilter, InternalExceptionFilter } from './shared/api/http-exception.filter';
import { StopModule } from './stop/stop.module';
import { VehicleModule } from './vehicle/vehicle.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new InternalExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  const internalConfig = new DocumentBuilder()
    .setTitle('Internal Leprechaun API')
    .setDescription('Internal API for the Leprechaun service')
    .setVersion('1.0')
    .build();

  const externalConfig = new DocumentBuilder()
    .setTitle('External Leprechaun API')
    .setDescription('External API for the Leprechaun service')
    .setVersion('1.0')
    .build();

  const internalDocumentFactory = () =>
    SwaggerModule.createDocument(app, internalConfig, {
      include: [InternalModule],
    });

  const externalDocumentFactory = () =>
    SwaggerModule.createDocument(app, externalConfig, {
      include: [LineModule, StopModule, AccidentModule, RouteModule, VehicleModule],
    });

  SwaggerModule.setup('/int/v1/docs/swagger', app, internalDocumentFactory, {
    jsonDocumentUrl: '/int/v1/docs/openapi.json',
  });

  SwaggerModule.setup('/ext/v1/docs/swagger', app, externalDocumentFactory, {
    jsonDocumentUrl: '/ext/v1/docs/openapi.json',
  });

  await app.listen(config.LEPRECHAUN_APP_PORT);
}
bootstrap();
