import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorizedPersonDto } from './dto/create-authorized-person.dto';
import { UpdateAuthorizedPersonDto } from './dto/update-authorized-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedPerson } from './entities/authorized-person.entity';
import { Repository } from 'typeorm';
import { AwsRecognitionService } from 'src/aws-recognition/aws-recognition.service';
import { ChildService } from 'src/child/child.service';

@Injectable()
export class AuthorizedPersonService {
  constructor(
    @InjectRepository(AuthorizedPerson)
    private authorizedPersonRepository: Repository<AuthorizedPerson>,
    private awsRecognitionService: AwsRecognitionService,
    private childService: ChildService,
  ){}

  async create(createAuthorizedPersonDto: CreateAuthorizedPersonDto) {
    const { img_url } = createAuthorizedPersonDto;
    let person = this.authorizedPersonRepository.create({...createAuthorizedPersonDto, img_url: img_url});
    return await this.authorizedPersonRepository.save(person);
  }

  async register(createAuthorizedPersonDto: CreateAuthorizedPersonDto, file: Express.Multer.File) {
    
    const indexFacesResult = await this.awsRecognitionService.indexFacesBuffer(file.buffer);

    if (indexFacesResult.error) {
      
      throw new NotFoundException('Face not found');
    
    }else {
      const { child_id } = createAuthorizedPersonDto;
      const child = await this.childService.findOne(child_id);

      if (!child) {
        throw new NotFoundException(`Child with ID ${child_id} not found`);
      }

      let person = this.authorizedPersonRepository.create({...createAuthorizedPersonDto, 
        img_url: indexFacesResult.img_url, 
        face_id: indexFacesResult.faceId,
        child: child
      });

      return await this.authorizedPersonRepository.save(person);
    }
  }

  async findAll() {
    return await this.authorizedPersonRepository.find();
  }

  async findOne(id: number) {
    const person = await this.authorizedPersonRepository.findOneBy({ id });

    if (!person) {
      throw new NotFoundException('Authorized Person not found');
    }

    return person;
  }

  async findByFaceId(faceId: string) {
    return await this.authorizedPersonRepository.findOneBy({ face_id: faceId });
  }

  async update(id: number, updateAuthorizedPersonDto: UpdateAuthorizedPersonDto) {
    const person = await this.authorizedPersonRepository.preload({
      id: id,
      ...updateAuthorizedPersonDto,
    });

    if (!person) {
      throw new NotFoundException('Authorized Person not found');
    }
    
    return await this.authorizedPersonRepository.save(person);
  }

  remove(id: number) {
    return `This action removes a #${id} authorizedPerson`;
  }

  async verifyFace(photo: Express.Multer.File) {
    const verifyFaceResult = await this.awsRecognitionService.getUserByFaceId(photo.buffer);

    if (verifyFaceResult.error) {
      throw new NotFoundException('Face not found');
    } else {
      return await this.findByFaceId(verifyFaceResult.faceId);
    }
  }
}
