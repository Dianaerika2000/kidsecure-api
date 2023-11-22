import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Child } from './entities/child.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFatherDto } from 'src/common/dtos/create-father.dto';
import { FatherService } from '../father/father.service';
import { Father } from 'src/father/entities/father.entity';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    private readonly fatherService: FatherService,
  ) {}

  async create(createChildDto: CreateChildDto) {
    const child = this.childRepository.create(createChildDto);
    return await this.childRepository.save(child);
  }

  async findAll() {
    return await this.childRepository.find();
  }

  async findOne(id: number) {
    const child = await this.childRepository.findOneBy({ id });

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

  remove(id: number) {
    return `This action removes a #${id} child`;
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
}
