import { Module } from '@nestjs/common';
import { AuthorizedPersonService } from './authorized-person.service';
import { AuthorizedPersonController } from './authorized-person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedPerson } from './entities/authorized-person.entity';
import { AwsRecognitionModule } from 'src/aws-recognition/aws-recognition.module';
import { ChildModule } from 'src/child/child.module';

@Module({
  controllers: [AuthorizedPersonController],
  providers: [AuthorizedPersonService],
  imports: [
    TypeOrmModule.forFeature([AuthorizedPerson]),
    AwsRecognitionModule,
    ChildModule,
  ],
  exports: [
    TypeOrmModule,
    AuthorizedPersonService,
  ]
})
export class AuthorizedPersonModule {}
