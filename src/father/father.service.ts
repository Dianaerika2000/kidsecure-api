import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFatherDto } from './dto/create-father.dto';
import { UpdateFatherDto } from './dto/update-father.dto';
import { Father } from './entities/father.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsRecognitionService } from 'src/aws-recognition/aws-recognition.service';

@Injectable()
export class FatherService {
  constructor(
    @InjectRepository(Father)
    private fatherRepository: Repository<Father>,
    private awsRecognitionService: AwsRecognitionService,
  ) {}

  async create(createFatherDto: CreateFatherDto, file: Express.Multer.File) {
    const indexFacesResult = await this.awsRecognitionService.indexFacesBuffer(file.buffer);

    if (indexFacesResult.error) {
      throw new NotFoundException('Face not found');
    }

    const father =  this.fatherRepository.create({
      ...createFatherDto,
      img_url: indexFacesResult.img_url,
      face_id: indexFacesResult.faceId,
    });

    return await this.fatherRepository.save(father);
  }

  async findAll() {
    return await this.fatherRepository.find(); 
  }

  async findOne(id: number) {
    const father = await this.fatherRepository.findOneBy({ id });

    if (!father) {
      throw new NotFoundException(`Father with ID ${id} not found`);
    }

    return father;
  }

  async update(id: number, updateFatherDto: UpdateFatherDto) {
    return `This action updates a #${id} father`;
  }

  async remove(id: number) {
    return `This action removes a #${id} father`;
  }
}
