import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateFatherDto {
  @IsString()
  name: string;

  @IsString()
  cellphone: string;

  @IsString()
  ci: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  img_url?: string;
}
