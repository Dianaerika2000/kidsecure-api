import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorizedPersonDto } from './create-authorized-person.dto';

export class UpdateAuthorizedPersonDto extends PartialType(CreateAuthorizedPersonDto) {}
