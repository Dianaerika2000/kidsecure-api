import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOutpuControlDto } from './dto/create-outpu-control.dto';
import { UpdateOutpuControlDto } from './dto/update-outpu-control.dto';
import { AwsRecognitionService } from 'src/aws-recognition/aws-recognition.service';
import { AuthorizedPersonService } from '../authorized-person/authorized-person.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OutpuControl } from './entities/outpu-control.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class OutpuControlService {
  constructor(
    @InjectRepository(OutpuControl)
    private outpuControlRepository: Repository<OutpuControl>,
    private authorizedPersonService: AuthorizedPersonService,
  ){}
  create(createOutpuControlDto: CreateOutpuControlDto) {
    return 'This action adds a new outpuControl';
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

    if (!child) {
      throw new NotFoundException('Esta persona no tiene un niño asignado');
    }

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

  async findAll() {
    const outputControls = await this.outpuControlRepository.find({
      order: {
        id: 'ASC',
      },
      relations: ['child', 'child.classroom', 'authorizedPerson'],
    });
  
    // Mapea los resultados para obtener la información deseada
    const formattedOutputControls = outputControls.map((outputControl) => {
      // Agrega verificaciones de nulidad para evitar errores
      const childName = outputControl.child?.name || 'N/A';
      const classroomName = outputControl.child?.classroom?.name || 'N/A';
      const personName = outputControl.authorizedPerson?.name || 'N/A';
  
      return {
        title: outputControl.title,
        childName,
        date: outputControl.date,
        personName,
        classroomName,
      };
    });
  
    return formattedOutputControls;
  }

  async getOutputControlForClassroom(classroomId: number) {
    const outputControls = await this.outpuControlRepository.find({
      where: {
        child: { classroom: { id: classroomId } },
      },
      order: {
        id: 'ASC',
      },
      relations: ['child', 'child.classroom', 'authorizedPerson'],
    });
  
    // Mapea los resultados para obtener la información deseada
    const formattedOutputControls = outputControls.map((outputControl) => {
      // Agrega verificaciones de nulidad para evitar errores
      const childName = outputControl.child?.name || 'N/A';
      const classroomName = outputControl.child?.classroom?.name || 'N/A';
      const personName = outputControl.authorizedPerson?.name || 'N/A';
  
      return {
        title: outputControl.title,
        childName,
        date: outputControl.date,
        personName,
        classroomName,
      };
    });
  
    return formattedOutputControls;
  }

  async getOutputControlByDate(startDate: Date, endDate: Date) {
    const outputControls = await this.outpuControlRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: {
        id: 'ASC',
      },
      relations: ['child', 'child.classroom', 'authorizedPerson'],
    });

    // Mapea los resultados para obtener la información deseada
    const formattedOutputControls = outputControls.map((outputControl) => ({
      title: outputControl.title,
      childName: outputControl.child?.name,
      date: outputControl.date,
      personName: outputControl.authorizedPerson?.name,
      classroom: outputControl.child?.classroom?.name,
    }));

    return formattedOutputControls;
  }
  
  async removeByConditions(conditions: Record<string, any>): Promise<void> {
    await this.outpuControlRepository.delete(conditions);
  }

  
}
