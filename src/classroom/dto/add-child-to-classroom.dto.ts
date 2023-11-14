import { IsArray, IsNumber } from "class-validator";

export class AddChildrenToClassroomDto {
  @IsArray()
  @IsNumber({}, { each: true })
  children: number[];
}