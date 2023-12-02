import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types as MongooseTypes } from 'mongoose';
import * as cryptoUtil from '../../core/tools/utils/crypto.util';
import { UserType } from './enum/usertype.enum';
import { UserState } from './enum/user.state';
import { AuditModel, BaseModel, createSchema } from 'src/core/model/base.model';

export type UserDocument = User & Document;


@Schema()
export class User extends BaseModel {

    @Prop({ required: true })
    email: string;

    @Prop()
    name: string;

    @Prop()
    surname: string;

    @Prop({ enum: [UserType.SYSTEM_USER, UserType.USER] })
    type: UserType;

    @Prop({
        enum: [UserState],
        default: UserState.NOT_VERIFIED
    })
    state: UserState;

    @Prop()
    password: string;

    @Prop({ type: Date })
    passwordExpireDate: Date;

    @Prop()
    salt: string;

    @Prop()
    lastLoginDate: Date; 
    

}

export const UserSchema = createSchema(User);

UserSchema.pre<UserDocument>('save', async function () {

    var user = this;

    if ((this.isModified(User["password"]) || this.isNew) && (user.password)) {

        const salt = cryptoUtil.generateSalt();
        const hash = cryptoUtil.hashPaswordBySalt(user.password, salt);
        user.password = hash;
        user.salt = salt;

    }
    user.audit.updatedDate = new Date();
});


