import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FatherService } from './father.service';
import { CreateFatherDto } from './dto/create-father.dto';
import { UpdateFatherDto } from './dto/update-father.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('father')
export class FatherController {
  constructor(private readonly fatherService: FatherService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  registert(
    @UploadedFile() photo: Express.Multer.File,
    @Body()data: any) {
    return this.fatherService.create(data, photo);
  }

  @Get()
  findAll() {
    return this.fatherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fatherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFatherDto: UpdateFatherDto) {
    return this.fatherService.update(+id, updateFatherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fatherService.remove(+id);
  }
}
