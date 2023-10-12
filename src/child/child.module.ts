import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ChildService } from './child.service';
import { ChildController } from './child.controller';
import { Child } from './entities/child.entity';

@Module({
  controllers: [ChildController],
  providers: [ChildService],
  imports: [
    TypeOrmModule.forFeature([ Child ]),
  ],
})
export class ChildModule {}
