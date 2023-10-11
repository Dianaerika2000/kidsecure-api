import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuthorizedPersonDto {
  @IsString()
  name: string;

  @IsString()
  cellphone: string;

  @IsString()
  ci: string;

  @IsOptional()
  @IsString()
  img_url?: string;

  @IsOptional()
  @IsNumber()
  user_id: number;
}
