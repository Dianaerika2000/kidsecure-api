import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';
import { Repository } from 'typeorm';
import { ChildService } from '../child/child.service';
import { AddChildrenToClassroomDto } from './dto/add-child-to-classroom.dto';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
    private childService: ChildService,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const classroom = this.classroomRepository.create(createClassroomDto);
    return await this.classroomRepository.save(classroom);
  }

  async findAll() {
    return await this.classroomRepository.find({
      order: {
        id: 'ASC',
      }
    });
  }

  async findOne(id: number) {
    const classroom = await this.classroomRepository.findOneBy({ id  });

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }

    return classroom;
  }

  update(id: number, updateClassroomDto: UpdateClassroomDto) {
    return `This action updates a #${id} classroom`;
  }

  async remove(id: number) {
    const classroom = await this.findOne(id);
    return await this.classroomRepository.remove(classroom);
  }

  async addChildToClassroom(classroomId: number, childId: number): Promise<Classroom> {
    const classroom = await this.classroomRepository.findOneBy({ id: classroomId});
    const child = await this.childService.findOne(childId);

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${classroomId} not found`);
    }

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }

    // Agregar el niño al aula
    classroom.children = [...classroom.children, child];

    // Guardar el aula actualizada
    return this.classroomRepository.save(classroom);
  }

  async addChildrenToClassroom(classroomId: number, addChildToClassroomDto:AddChildrenToClassroomDto){
    const { children = [] } = addChildToClassroomDto;
    const classroom = await this.classroomRepository.findOneBy({ id: classroomId});

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${classroomId} not found`);
    }
    // Obtener las instancias de Child por sus IDs
    const childInstances = await Promise.all(children.map(childId => this.childService.findOne(childId)));

    // Asignar los niños al aula
    classroom.children = [...classroom.children, ...childInstances];

    // Guardar el aula actualizada
    return this.classroomRepository.save(classroom);
  }
}
