
import { IsArray, IsBoolean, IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';
import { RegexClass } from 'src/core/tools/enums/validation.enum';
import { UserState } from '../enum/user.state';
import { UserType } from '../enum/usertype.enum';
import { User } from '../user.model';
 

export class ResendVerifyEmailRequestDto {
    @IsEmail()
    readonly email: User["email"];

    @IsEnum(UserType)
    readonly userType : UserType;
}

export class VerifyEmailRequestDto {
    @IsString()
    readonly token: string;
}

export class SignInRequestDto {

    @IsEmail()
    readonly email: User["email"];

    @IsString()
    readonly password: User["password"];
 

}
export class VerifySignInRequestDto {
    @IsString()
    token: string;

    @IsString()
    verificationCode: string;

} 

export class ForgetPasswordRequestDto {
    @IsEmail()
    readonly email: User["email"];

    @IsEnum(UserType)
    readonly userType : UserType;
}
 