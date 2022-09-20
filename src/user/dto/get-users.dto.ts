import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class GetUsersDTO {
  @IsOptional() @IsInt() @Type(() => Number) take?: number;
  @IsOptional() @IsInt() @Type(() => Number) skip?: number;
  @IsOptional() @IsString() search?: string;
}
