import { UserType } from "../enum/usertype.enum";
import { User } from "../user.model";

export class AuthenticatedUserDto {

    public id: User["id"];
    public email: User["email"];
    public type: User["type"];
    public state: User["state"];
    public name?: User["name"];
    public surname?: User["surname"];
    public isUser: boolean = false;
    public isSystemUser: boolean = false;
    static from(user: User): AuthenticatedUserDto {
        var authUser = new AuthenticatedUserDto();
        authUser.id = user.id;
        authUser.email = user.email;
        authUser.type = user.type;
        authUser.state = user.state;
        authUser.name = user.name;
        authUser.surname = user.surname;
        authUser.isUser = user.type == UserType.USER;
        authUser.isSystemUser = user.type == UserType.SYSTEM_USER;
        return authUser;
    }

}



