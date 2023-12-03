import { User } from "../user.model";

export class SignInResponseDto {
    token: string; 
}


export class VerifySignInResponseDto {
    accessToken: string; 
    authendicatedUser: AuthendicatedUserInfoResponseDto; 
}

export class AuthendicatedUserInfoResponseDto {

    id: User["id"];
    email: User["email"]; 
    type: User["type"];  
    name: User["name"];   
    surname: User["surname"];    
    isSystemUSer?: boolean = false; 

}
