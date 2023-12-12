import {
  CreateCollectionCommand,
  GetContentModerationCommand,
  GetLabelDetectionCommand,
  IndexFacesCommand,
  RekognitionClient,
  SearchFacesByImageCommand,
  SearchFacesByImageCommandOutput,
  StartContentModerationCommand,
  StartLabelDetectionCommand,
} from '@aws-sdk/client-rekognition';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleTranslateService } from 'src/google-translate/google-translate.service';

@Injectable()
export class AwsRecognitionService {
  constructor(
    private readonly configService: ConfigService,
    private googleTransalteService: GoogleTranslateService
  ) {}

  async detectLabels(photo: string) {
    // Connects to AWS Rekognition service
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    // Transforms the image represented as base64 into a bytes buffer
    const photoBuffer = Buffer.from(
      photo.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    // Create an instance of the DetectLabelsImageProperties class
    // const command = new DetectLabelsCommand({
    //   Image: {
    //     Bytes: photoBuffer,
    //   },
    //   MaxLabels: 10,
    // });

    // try {
    //   // Send the command to Amazon Rekognition
    //   const results = await rekognitionClient.send(command);
    //   return results.Labels.map((label) => label.Name);
    // } catch (error) {
    //   console.error(error);
    // }
  }

  async createCollection(collectionName: string) {
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    try {
      console.log(`Creating collection: ${collectionName}`);
      const data = await rekognitionClient.send(
        new CreateCollectionCommand({ CollectionId: collectionName }),
      );
      return data;
    } catch (error) {
      console.log('Error', error.stack);
    }
  }

  async indexFaces(profilePhotoBase64: string) {
    // Step 1: Connects to AWS Rekognition service
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  
    const rekognitionCollection = this.configService.get('AWS_REKOGNITION_COLLECTION');
  
    // Transforms the image represented as base64 into a bytes buffer
    const profilePhotoBuffer = Buffer.from(
      profilePhotoBase64.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
  
    // Index the face in the collection
    const insertInCollectionResult = await rekognitionClient.send(
      new IndexFacesCommand({
        CollectionId: rekognitionCollection,
        Image: {
          Bytes: profilePhotoBuffer,
        },
        MaxFaces: 1,
        QualityFilter: 'MEDIUM',
      }),
    );

    console.log(insertInCollectionResult);
    
    return insertInCollectionResult;

    // const faceId = insertInCollectionResult?.FaceRecords[0]?.Face?.FaceId;
    // const successfullyInsertedInCollection =
    //   insertInCollectionResult.$metadata.httpStatusCode === 200 && faceId;
    
    // // Step 2: Call the `uploadProfilePhotoToS3()` function to upload the user's image to S3
    // // const { profilePhotoUrl } = await this.uploadProfilePhotoToS3(profilePhotoBuffer, faceId);
    
    // if (successfullyInsertedInCollection) {
    //   return {
    //     message: 'Successfully indexed the face in the collection.',
    //     faceId
    //   };
    // } else {
    //   return {
    //     error: 'Something went wrong while indexing the face in the collection.',
    //   };
    // }
  }

  async indexFacesBuffer(profilePhoto: Buffer) {
    // Step 1: Connects to AWS Rekognition service
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  
    const rekognitionCollection = this.configService.get('AWS_REKOGNITION_COLLECTION');
  
    // Index the face in the collection
    const insertInCollectionResult = await rekognitionClient.send(
      new IndexFacesCommand({
        CollectionId: rekognitionCollection,
        Image: {
          Bytes: profilePhoto,
        },
        MaxFaces: 1,
        QualityFilter: 'MEDIUM',
      }),
    );

    const faceId = insertInCollectionResult?.FaceRecords[0]?.Face?.FaceId;
    const successfullyInsertedInCollection = insertInCollectionResult.$metadata.httpStatusCode === 200 && faceId;
    
    // Step 2: Call the `uploadProfilePhotoToS3()` function to upload the user's image to S3
    const { profilePhotoUrl } = await this.uploadProfilePhotoToS3(profilePhoto, faceId);
    
    if (successfullyInsertedInCollection) {
      return {
        message: 'Successfully indexed the face in the collection.',
        faceId,
        img_url: profilePhotoUrl
      };
    } else {
      return {
        error: 'Something went wrong while indexing the face in the collection.',
      };
    }
  }

  async getUserByFaceId(profilePhoto: Buffer) {

    // Connects to AWS Rekognition service
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      }
    });

    // Search faces in our collection using the main face from the image (if it exist)
    const searchFacesResult: SearchFacesByImageCommandOutput = await rekognitionClient.send(new SearchFacesByImageCommand({
      CollectionId: this.configService.get('AWS_REKOGNITION_COLLECTION'),
      Image: {
        Bytes: profilePhoto
      },
      MaxFaces: 1,
      QualityFilter: 'MEDIUM'
    }))

    const faceId = searchFacesResult?.FaceMatches[0]?.Face?.FaceId
    const found = searchFacesResult?.$metadata?.httpStatusCode === 200 && faceId

    if (found) {
      return {
        message: 'Successfully found user by profile photo.',
        faceId
      }
    } else {
      return {
        error: "Couldn't find user by profile photo."
      }
    }
  }

  async uploadProfilePhotoToS3( profilePhotoBuffer: Buffer, faceId: string) {

    const s3Bucket = this.configService.get('AWS_S3_BUCKET');

    // Step 1: Connects to AWS S3 service
    const s3Client = new S3Client({
      region: this.configService.get('AWS_REGION_S3'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    // Step 2: Create an S3 object with the user's image
    const s3Object = await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: `user_avatar_${faceId}.jpeg`,
        Body: profilePhotoBuffer,
        ContentType: 'image/jpeg',
      }),
    );
    
    const s3ObjectUrl = `https://${s3Bucket}.s3.amazonaws.com/user_avatar_${faceId}.jpeg`;
  
    return {
      profilePhotoUrl: s3ObjectUrl,
    };
  }

  async uploadVideoToS3(videoBuffer: Buffer, videoId: string): Promise<{ videoUrl: string }> {
    const s3Bucket = this.configService.get('AWS_S3_BUCKET');

    // Step 1: Connect to AWS S3 service
    const s3Client = new S3Client({
      region: this.configService.get('AWS_REGION_S3'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    // Step 2: Create an S3 object with the video
    const s3Object = await s3Client.send(
        new PutObjectCommand({
        Bucket: s3Bucket,
        Key: `video_${videoId}.mp4`,
        Body: videoBuffer,
        ContentType: 'video/mp4',
      }),
    );

    const s3ObjectUrl = `https://${s3Bucket}.s3.amazonaws.com/video_${videoId}.mp4`;
  
    return {
      videoUrl: s3ObjectUrl,
    };
  }

  async startLabelDetection(bucketName: string, videoId: string) {
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION_S3'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      }
    });

    const startLabelDetectionResult = await rekognitionClient.send(new StartLabelDetectionCommand({
      Video: {
        S3Object: {
          Bucket: bucketName,
          Name: `${videoId}`
        }
      },
      MinConfidence: 50
    }))

    return startLabelDetectionResult
  }

  // async getLabelDetectionResults(jobId: string) {
  //   const rekognitionClient = new RekognitionClient({
  //     region: this.configService.get('AWS_REGION_S3'),
  //     credentials: {
  //       accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
  //       secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  //     }
  //   });

  //   const getLabelDetectionResult = await rekognitionClient.send(new StartLabelDetectionCommand({
  //     JobId: jobId
  //   }))

  //   return getLabelDetectionResult
  // }
  
  async startContentModeration(bucketName: string, videoId: string) {
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION_S3'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      }
    });

    const startContentModerationResult = await rekognitionClient.send(new StartContentModerationCommand({
      Video: {
        S3Object: {
          Bucket: bucketName,
          Name: `${videoId}`
        }
      },
      MinConfidence: 50
    }))

    return startContentModerationResult
  }

  async getLabelDetection(jobId: string) {
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION_S3'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      }
    });

    let labels: any[] = [];
    let nextToken: string | undefined;

    do {
      const response = await rekognitionClient.send(new GetLabelDetectionCommand({
        JobId: jobId,
        NextToken: nextToken
      }));

      nextToken = response.NextToken;
      labels.push(response.Labels);
    } while (nextToken);

    return labels;
  }

  async getContentModeration(jobId: string) {
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION_S3'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      }
    });

    let labels: any[] = [];
    let nextToken: string | undefined;

    do {
      const response = await rekognitionClient.send(new GetContentModerationCommand({
        JobId: jobId,
        NextToken: nextToken
      }));

      nextToken = response.NextToken;
      labels.push(response.ModerationLabels);
    } while (nextToken);

    return labels.flat();
  }

  async getOnlyLabels(labels: any[]) {
    const namesLabel = labels.map((label) => label.ModerationLabel.Name);
    const labelsTranslated = await this.googleTransalteService.translateText(namesLabel, 'es');
    return labelsTranslated;
  }
}
