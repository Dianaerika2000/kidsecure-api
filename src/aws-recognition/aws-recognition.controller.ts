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

  @Post('upload/video')
  @UseInterceptors(FileInterceptor('video'))
  uploadVideoToS3(
    @UploadedFile() video: Express.Multer.File,
    ) {
    return this.awsRecognitionService.uploadVideoToS3(video.buffer, video.originalname);
  }

  @Post('detectLabels/video')
  startLabelDetection(@Body('bucketName') bucketName: string, @Body('videoId')videoId: string) {
    return this.awsRecognitionService.startLabelDetection(bucketName, videoId);
  }

  @Post('getLabelDetection')
  getLabelDetection(@Body('jobId') jobId: string) {
    return this.awsRecognitionService.getLabelDetection(jobId);
  }

  @Post('contentModeration/video')
  startContentModeration(@Body('bucketName') bucketName: string, @Body('videoId')videoId: string) {
    return this.awsRecognitionService.startContentModeration(bucketName, videoId);
  }

  @Post('getContentModeration')
  getContentModeration(@Body('jobId') jobId: string) {
    return this.awsRecognitionService.getContentModeration(jobId);
  }

  @Post('labels')
  getLabel(@Body() body: any) {
    return this.awsRecognitionService.getOnlyLabels(body.labels);
  }
}
