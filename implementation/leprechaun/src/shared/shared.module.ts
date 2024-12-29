import { Module } from '@nestjs/common';
import { ValidationService } from './api/validation.service';

@Module({
  providers: [ValidationService],
  exports: [ValidationService],
})
export class SharedModule {}
