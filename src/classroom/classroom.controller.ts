import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { AddChildrenToClassroomDto } from './dto/add-child-to-classroom.dto';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.create(createClassroomDto);
  }

  @Get()
  findAll() {
    return this.classroomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classroomService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassroomDto: UpdateClassroomDto) {
    return this.classroomService.update(+id, updateClassroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classroomService.remove(+id);
  }

  @Patch(':idClassroom/children/:childId')
  addChildToClassroom(@Param('idClassroom', ParseIntPipe) idClassroom: number, @Param('childId', ParseIntPipe) childId: number) {
    return this.classroomService.addChildToClassroom(idClassroom, childId);
  
  }
  @Patch(':idClassroom/children')
  addChildrenToClassroom(@Param('idClassroom', ParseIntPipe) idClassroom: number, @Body() addChildrenToClassroomDto: AddChildrenToClassroomDto) {
    return this.classroomService.addChildrenToClassroom(idClassroom, addChildrenToClassroomDto);
  }
}
