import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthorizedPersonService } from './authorized-person.service';
import { CreateAuthorizedPersonDto } from './dto/create-authorized-person.dto';
import { UpdateAuthorizedPersonDto } from './dto/update-authorized-person.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('authorized-person')
export class AuthorizedPersonController {
  constructor(private readonly authorizedPersonService: AuthorizedPersonService) {}

  @Post()
  create(@Body() createAuthorizedPersonDto: CreateAuthorizedPersonDto) {
    // return this.authorizedPersonService.create(createAuthorizedPersonDto);
    // return this.authorizedPersonService.register(createAuthorizedPersonDto);
  }

  @Get()
  findAll() {
    return this.authorizedPersonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authorizedPersonService.findOne(id);
  }

  @Get('face/:faceId')
  findByFaceId(@Param('faceId') faceId: string) {
    return this.authorizedPersonService.findByFaceId(faceId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAuthorizedPersonDto: UpdateAuthorizedPersonDto) {
    return this.authorizedPersonService.update(+id, updateAuthorizedPersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.authorizedPersonService.remove(id);
  }

  // @Post('register')
  // @UseInterceptors(FileInterceptor('photo'))
  // register(
  //   @UploadedFile() photo: Express.Multer.File,
  //   @Body() createAuthorizedPersonDto: CreateAuthorizedPersonDto,) {
  //   return this.authorizedPersonService.register(createAuthorizedPersonDto, photo);
  // }

  @Post('register')
  @UseInterceptors(FileInterceptor('photo'))
  registert(
    @UploadedFile() photo: Express.Multer.File,
    @Body()data: any) {
    return this.authorizedPersonService.register(data, photo);
  }

  @Post('verify')
  @UseInterceptors(FileInterceptor('photo'))
  verify(
    @UploadedFile() photo: Express.Multer.File) {
    return this.authorizedPersonService.verifyFace(photo);
  }

  @Get(':id/children')
  getChildForAuthorizedPerson(@Param('id') id: number){
    return this.authorizedPersonService.getChildForAuthorizedPerson(id);
  }
}
