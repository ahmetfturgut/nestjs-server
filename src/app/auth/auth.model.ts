import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types as MongooseTypes } from 'mongoose'; 
import { BaseModel, createSchema } from '../_common/model/base.model';
import { AuthState } from './enums/auth.state';
import { AuthType } from './enums/auth.type';
import { User } from '../user/user.model';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth extends BaseModel {

	@Prop({ type: MongooseTypes.ObjectId, ref: 'User' })
    userId: User["id"];

    @Prop({ type: MongooseTypes.ObjectId , ref: 'User' })
    user: User;

    @Prop({default: AuthState.PASSIVE})
    state: AuthState;

    @Prop({required : true})
    type: AuthType;

    @Prop()
    signInDate : Date;

    @Prop()
    signOutDate : Date;
    
    @Prop()
    lastRequestDate : Date;    

    @Prop()
    expiresIn : Date;    

    @Prop()
    token: string;
 
    @Prop()
    verificationCode: string; 

    @Prop({ default: 0 })
	invalidTokenCount: number; 

}

export const AuthSchema = createSchema(Auth);


// AuthSchema.pre(
// 	/^(save|update|updateOne|findByIdAndUpdate|findOneAndUpdate)$/, async function (next) {

//     const auth = this.getUpdate ? this.getUpdate() : this;

// 	if (auth.userId) {
// 		auth.user = new User();
// 		auth.user["_id"] = new MongooseTypes.ObjectId(auth.userId);
// 	}
// 	next()
// });