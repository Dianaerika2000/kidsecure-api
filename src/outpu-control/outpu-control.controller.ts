import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { OutpuControlService } from './outpu-control.service';
import { CreateOutpuControlDto } from './dto/create-outpu-control.dto';
import { UpdateOutpuControlDto } from './dto/update-outpu-control.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('outpu-control')
export class OutpuControlController {
  constructor(private readonly outpuControlService: OutpuControlService) {}

  @Post()
  create(@Body() createOutpuControlDto: CreateOutpuControlDto) {
    return this.outpuControlService.create(createOutpuControlDto);
  }

  @Get()
  findAll() {
    return this.outpuControlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outpuControlService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutpuControlDto: UpdateOutpuControlDto) {
    return this.outpuControlService.update(+id, updateOutpuControlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outpuControlService.remove(+id);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('photo'))
  registert(
    @UploadedFile() photo: Express.Multer.File,
    ) {
    return this.outpuControlService.register(photo);
  }
}
