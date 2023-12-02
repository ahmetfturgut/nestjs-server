import { IsEmail, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

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
    @IsNotEmpty()
    @Min(6)
    @Max(10)
    password: string;

}


export class UpdateUserRequestDto {

    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    surname: string;

    @IsString()
    @IsOptional()
    password: string;

}
