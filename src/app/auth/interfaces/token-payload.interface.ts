 
import { User } from "../../../app/user/user.model";
import { Auth } from "../auth.model";

export interface ITokenPayload {
    authId : Auth["id"];
    userId: User["id"]; 
}