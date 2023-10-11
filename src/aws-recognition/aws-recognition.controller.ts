import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AwsRecognitionService } from './aws-recognition.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('aws-recognition')
export class AwsRecognitionController {
  constructor(private readonly awsRecognitionService: AwsRecognitionService) {}

  @Post()
  create(@Body('collectionName') collectionName: string) {
    return this.awsRecognitionService.createCollection(collectionName);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo'))
  register(
    @UploadedFile() photo: Express.Multer.File,
    ) {
    return this.awsRecognitionService.indexFacesBuffer(photo.buffer);
  }

  @Post('indexFaces')
  indexFaces(@Body('photo') photo: string) {
    return this.awsRecognitionService.indexFaces(photo);
  }
}
