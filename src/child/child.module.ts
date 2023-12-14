import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ChildService } from './child.service';
import { ChildController } from './child.controller';
import { Child } from './entities/child.entity';
import { FatherModule } from 'src/father/father.module';
import { AuthorizedPersonModule } from 'src/authorized-person/authorized-person.module';
import { OutpuControlService } from 'src/outpu-control/outpu-control.service';
import { OutpuControl } from 'src/outpu-control/entities/outpu-control.entity';
import { AuthorizedPerson } from 'src/authorized-person/entities/authorized-person.entity';

@Module({
  controllers: [ChildController],
  providers: [ChildService],
  imports: [
    TypeOrmModule.forFeature([ Child, OutpuControl, AuthorizedPerson ]),
    FatherModule,
  ],
  exports: [
    TypeOrmModule,
    ChildService,
  ]
})
export class ChildModule {}
