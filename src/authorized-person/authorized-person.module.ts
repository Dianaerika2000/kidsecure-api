import { Module } from '@nestjs/common';
import { AuthorizedPersonService } from './authorized-person.service';
import { AuthorizedPersonController } from './authorized-person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedPerson } from './entities/authorized-person.entity';
import { AwsRecognitionModule } from 'src/aws-recognition/aws-recognition.module';
import { ChildModule } from 'src/child/child.module';
import { OutpuControl } from 'src/outpu-control/entities/outpu-control.entity';

@Module({
  controllers: [AuthorizedPersonController],
  providers: [AuthorizedPersonService],
  imports: [
    TypeOrmModule.forFeature([AuthorizedPerson, OutpuControl]),
    AwsRecognitionModule,
    ChildModule,
  ],
  exports: [
    TypeOrmModule,
    AuthorizedPersonService,
  ]
})
export class AuthorizedPersonModule {}
