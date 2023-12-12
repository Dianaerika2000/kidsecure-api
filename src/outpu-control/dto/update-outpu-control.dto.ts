import { PartialType } from '@nestjs/mapped-types';
import { CreateOutpuControlDto } from './create-outpu-control.dto';

export class UpdateOutpuControlDto extends PartialType(CreateOutpuControlDto) {}
