import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class CreateChildDto {
  @IsString()
  name: string;
  
  @IsDate()
  @Type(() => Date)
  birthdate: string;

  @IsString()
  gender: string;

  @IsString()
  allergies: string;
}
