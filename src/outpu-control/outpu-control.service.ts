import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOutpuControlDto } from './dto/create-outpu-control.dto';
import { UpdateOutpuControlDto } from './dto/update-outpu-control.dto';
import { AwsRecognitionService } from 'src/aws-recognition/aws-recognition.service';
import { AuthorizedPersonService } from '../authorized-person/authorized-person.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OutpuControl } from './entities/outpu-control.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OutpuControlService {
  constructor(
    @InjectRepository(OutpuControl)
    private outpuControlRepository: Repository<OutpuControl>,
    private authorizedPersonService: AuthorizedPersonService,
    private awsRekognitionService: AwsRecognitionService,
  ){}
  create(createOutpuControlDto: CreateOutpuControlDto) {
    return 'This action adds a new outpuControl';
  }

  findAll() {
    return `This action returns all outpuControl`;
  }

  findOne(id: number) {
    return `This action returns a #${id} outpuControl`;
  }

  update(id: number, updateOutpuControlDto: UpdateOutpuControlDto) {
    return `This action updates a #${id} outpuControl`;
  }

  remove(id: number) {
    return `This action removes a #${id} outpuControl`;
  }

  async register(photo: Express.Multer.File) {
    const person = await this.authorizedPersonService.verifyFace(photo);

    if (!person) {
      throw new NotFoundException('Persona no autorizada');
    }

    const child = await this.authorizedPersonService.getChildForAuthorizedPerson(person.id)

    const outputControl = this.outpuControlRepository.create({
      title: 'Registro de salida',
      authorizedPerson: person,
      child: child
    })

    await this.outpuControlRepository.save(outputControl);

    return {
      title: outputControl.title,
      child: outputControl.child.name,
      date: outputControl.date,
      person: outputControl.authorizedPerson.name
    }
  }
  
}
