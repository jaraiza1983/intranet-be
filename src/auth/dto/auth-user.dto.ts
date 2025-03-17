import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class AuthUserDto{

    @IsString()
    @IsEmail()
    email: string;

}