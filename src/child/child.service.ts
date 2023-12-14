import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Child } from './entities/child.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFatherDto } from 'src/common/dtos/create-father.dto';
import { FatherService } from '../father/father.service';
import { Father } from 'src/father/entities/father.entity';
import { AuthorizedPersonService } from 'src/authorized-person/authorized-person.service';
import { OutpuControl } from 'src/outpu-control/entities/outpu-control.entity';
import { AuthorizedPerson } from 'src/authorized-person/entities/authorized-person.entity';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,

    @InjectRepository(OutpuControl)
    private outputControlRepository: Repository<OutpuControl>,

    @InjectRepository(AuthorizedPerson)
    private authorizedPersonRepository: Repository<AuthorizedPerson>,

    private readonly fatherService: FatherService,
  ) {}

  async create(createChildDto: CreateChildDto) {
    const child = this.childRepository.create(createChildDto);
    return await this.childRepository.save(child);
  }

  async findAll() {
    return await this.childRepository.find({
      order: {
        id: 'ASC',
      }
    });
  }

  async findOne(id: number) {
    const child = await this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.fathers', 'fathers')
      .leftJoinAndSelect('child.authorizedPersons', 'authorizedPersons')
      .where('child.id = :id', { id })
      .getOne();

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    return child;
  }

  async update(id: number, updateChildDto: UpdateChildDto) {
    const child = await this.childRepository.preload({
      id: id,
      ...updateChildDto,
    });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    return await this.childRepository.save(child);
  }

  async registerFatherForChild(childId: number, fatherData: CreateFatherDto, file: Express.Multer.File): Promise<Child> {
    const child = await this.childRepository.findOne({ where: { id: childId }, relations: ["fathers"] });

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }

    // Crear una nueva instancia de Father con los datos proporcionados
    const newFather = await this.fatherService.create(fatherData, file);

    if (!newFather) {
      throw new NotFoundException(`Father with ID not found`);
    }
    
    // Asignar el nuevo padre al niño
    child.fathers = [ ...child.fathers, newFather];

    // Guardar el niño actualizado en la base de datos
    return this.childRepository.save(child);
  }

  async registerFathersForChild2(childId: number, fatherId: number) {
    const child = await this.childRepository.findOne({ where: { id: childId }, relations: ["fathers"] });

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }

    // Obtener el padre de la base de datos
    const father = await this.fatherService.findOne(fatherId);

    if (!father) {
      throw new NotFoundException(`Father with ID ${fatherId} not found`);
    }

    // const fhaters =  child.fathers; 
    // return fhaters;

    // Verificar si el niño ya tiene padres registrados
    // if (child.fathers && child.fathers.length > 0) {
    //   // Si ya tiene padres, agregar el nuevo padre si no está registrado
    //   if (!child.fathers.some(f => f.id === father.id)) {
    //     child.fathers.push(father);
    //   }
    // } else {
    //   // Si no tiene padres, asignar el nuevo padre al array
    // }
    
    child.fathers = [...child.fathers, father];
    // Guardar el niño actualizado en la base de datos
    return this.childRepository.save(child);
  }

  async getFathersForChild(childId: number): Promise<Father[]> {
    const child = await this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.fathers', 'father')
      .where('child.id = :id', { id: childId })
      .getOne();

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }

    return child.fathers;
  }

  async getAuthorizedPersonsForChild(childId: number) {
    const child = await this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.authorizedPersons', 'authorizedPerson')
      .where('child.id = :id', { id: childId })
      .getOne();
  
    return child?.authorizedPersons || [];
  }

  async remove(id: number) {
    const child = await this.childRepository.findOne({
      where: { id },
      relations: ['authorizedPersons', 'outputControls'],
    });
  
    if (!child) {
      throw new NotFoundException('Child not found');
    }
  
    // Elimina registros relacionados en las tablas AuthorizedPerson y OutpuControl
    if (child.authorizedPersons && child.authorizedPersons.length > 0) {
      await this.authorizedPersonRepository.remove(child.authorizedPersons);
    }
  
    if (child.outputControls && child.outputControls.length > 0) {
      await this.outputControlRepository.remove(child.outputControls);
    }
  
    // Luego, elimina al niño
   return await this.childRepository.remove(child);
  }

  async getAllChildrenWithDetails(): Promise<any[]> {
    const children = await this.childRepository.find({
      relations: ['fathers', 'classroom'],
    });
  
    return children.map(child => ({
      nameChild: child.name,
      fathers: child.fathers.map(father => ({
        name: father.name,
        cellphone: father.cellphone,
      })),
      classroom: child.classroom.name,
    }));
  }
   
}
