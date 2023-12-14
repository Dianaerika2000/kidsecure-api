import { Module } from '@nestjs/common';
import { OutpuControlService } from './outpu-control.service';
import { OutpuControlController } from './outpu-control.controller';
import { AwsRecognitionModule } from 'src/aws-recognition/aws-recognition.module';
import { AuthorizedPersonModule } from 'src/authorized-person/authorized-person.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutpuControl } from './entities/outpu-control.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OutpuControl,
    ]),
    AwsRecognitionModule,
    AuthorizedPersonModule,
  ],
  controllers: [OutpuControlController],
  providers: [OutpuControlService],
  exports: [
    TypeOrmModule,
    OutpuControlService,
  ]
})
export class OutpuControlModule {}
