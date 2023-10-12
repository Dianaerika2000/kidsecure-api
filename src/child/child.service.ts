import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Child } from './entities/child.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
  ) {}
  async create(createChildDto: CreateChildDto) {
    const child = this.childRepository.create(createChildDto);
    return await this.childRepository.save(child);
  }

  async findAll() {
    return await this.childRepository.find();
  }

  async findOne(id: number) {
    const child = this.childRepository.findOneBy({ id });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    return await child;
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
}
