import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, Max, Min } from "class-validator";
import { RegexClass } from "src/core/tools/enums/validation.enum";

export class CreateUserRequestDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    surname: string;

    @IsString()  
    @Matches(RegexClass.PASSWORD, { message: "password error" })
    password: string;

}


export class UpdateUserRequestDto {

    @IsString()
    @IsNotEmpty()
    id: string 

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    surname: string;
 

}
