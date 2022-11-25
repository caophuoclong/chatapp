import { ApiQuery } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, Max } from "class-validator";

export class PaginateDto{
    @IsOptional()
    skip: number;
    @IsOptional()
    limit: number 
}