import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsNumber() id: number;
  @IsString() @IsNotEmpty() name: string;
}
