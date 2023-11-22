import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { CreateFatherDto } from 'src/common/dtos/create-father.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post()
  create(@Body() createChildDto: CreateChildDto) {
    return this.childService.create(createChildDto);
  }

  @Get()
  findAll() {
    return this.childService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.childService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChildDto: UpdateChildDto) {
    return this.childService.update(+id, updateChildDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.childService.remove(+id);
  }

  @Patch(':id/father')
  @UseInterceptors(FileInterceptor('photo'))
  registerFatherForChild(
    @Param('id', ParseIntPipe) childId: number,
    @UploadedFile() photo: Express.Multer.File,
    @Body() fatherData: any) {
    return this.childService.registerFatherForChild(childId, fatherData, photo);
  }

  @Patch(':id/father/:fatherId')
  registerFathersForChild2(
    @Param('id', ParseIntPipe) childId: number,
    @Param('fatherId', ParseIntPipe) fatherId: number) {
    return this.childService.registerFathersForChild2(childId, fatherId);
  }

  @Get(':id/father')
  getFathersForChild(
    @Param('id', ParseIntPipe) childId: number
  ) {
    return this.childService.getFathersForChild(childId);
  }
}
