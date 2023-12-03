 
import { AuthenticatedUserDto } from "src/app/user/dto/authenticated-user.dto";
import { Auth } from "../auth.model";

export class AuthenticatedUserAuthDto  {  
    public id: Auth["id"];
    public userId: Auth["userId"];
    
    public state: Auth["state"];
    public type: Auth["type"];
    public token: Auth["token"]; 
    public lastRequestDate: Auth["lastRequestDate"];
    public authendicatedUser: AuthenticatedUserDto;

    static from(auth: Auth) : AuthenticatedUserAuthDto {
        var newAuth = new AuthenticatedUserAuthDto();        
        newAuth.id = auth.id;
        newAuth.userId = auth.userId;
        newAuth.state = auth.state;
        newAuth.type = auth.type;
        newAuth.token = auth.token; 
        newAuth.lastRequestDate = auth.lastRequestDate; 
        newAuth.authendicatedUser = AuthenticatedUserDto.from(auth.user);
        return newAuth;
    }

}
