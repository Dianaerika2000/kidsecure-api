import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ChildService } from './child.service';
import { ChildController } from './child.controller';
import { Child } from './entities/child.entity';
import { FatherModule } from 'src/father/father.module';

@Module({
  controllers: [ChildController],
  providers: [ChildService],
  imports: [
    TypeOrmModule.forFeature([ Child ]),
    FatherModule,
  ],
  exports: [
    TypeOrmModule,
    ChildService,
  ]
})
export class ChildModule {}
