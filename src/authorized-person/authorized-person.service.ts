import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorizedPersonDto } from './dto/create-authorized-person.dto';
import { UpdateAuthorizedPersonDto } from './dto/update-authorized-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedPerson } from './entities/authorized-person.entity';
import { Repository } from 'typeorm';
import { AwsRecognitionService } from 'src/aws-recognition/aws-recognition.service';
import { ChildService } from 'src/child/child.service';
import { Child } from 'src/child/entities/child.entity';
import { OutpuControl } from 'src/outpu-control/entities/outpu-control.entity';

@Injectable()
export class AuthorizedPersonService {
  constructor(
    @InjectRepository(AuthorizedPerson)
    private authorizedPersonRepository: Repository<AuthorizedPerson>,

    @InjectRepository(OutpuControl)
    private outpuControlRepository: Repository<OutpuControl>,
    
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
    return await this.authorizedPersonRepository.find(
      {
        order: {
          id: 'ASC',
        },
      }
    );
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

  async remove(id: number) {
    const authorizedPerson = await this.authorizedPersonRepository.findOne({
      where: { id },
      relations: ['outputControls'],
    });

    if (!authorizedPerson) {
      throw new NotFoundException(`Authorized person with ID ${id} not found`);
    }

    // Verifica si la propiedad outputControls existe y tiene al menos un elemento
    if (authorizedPerson.outputControls && authorizedPerson.outputControls.length > 0) {
      // Si existen registros en outputControls, los elimina de la tabla OutpuControl
      await this.outpuControlRepository.remove(authorizedPerson.outputControls);
    }

    // Elimina la persona autorizada
    return await this.authorizedPersonRepository.remove(authorizedPerson);
  }

  async verifyFace(photo: Express.Multer.File) {
    const verifyFaceResult = await this.awsRecognitionService.getUserByFaceId(photo.buffer);

    if (verifyFaceResult.error) {
      throw new NotFoundException('Face not found');
    } else {
      return await this.findByFaceId(verifyFaceResult.faceId);
    }
  }

  async getChildForAuthorizedPerson(authorizedPersonId: number): Promise<Child | undefined> {
    const authorizedPerson = await this.authorizedPersonRepository
      .createQueryBuilder('authorizedPerson')
      .leftJoinAndSelect('authorizedPerson.child', 'child')
      .where('authorizedPerson.id = :id', { id: authorizedPersonId })
      .getOne();

    return authorizedPerson?.child;
  }

  async removeByConditions(conditions: Record<string, any>): Promise<void> {
    await this.authorizedPersonRepository.delete(conditions);
  }
}
