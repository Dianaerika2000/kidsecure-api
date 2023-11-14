import { PartialType } from '@nestjs/mapped-types';
import { CreateFatherDto } from './create-father.dto';

export class UpdateFatherDto extends PartialType(CreateFatherDto) {}
