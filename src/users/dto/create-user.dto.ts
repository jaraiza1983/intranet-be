import { IsArray, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    fullName: string;

    @IsString({ each: true})
    @IsArray()
    roles: string[]


}