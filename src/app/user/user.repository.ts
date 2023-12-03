import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from './user.model';
import { Repository } from 'src/app/_common/repository/repository';

@Injectable()
export class UserRepository extends Repository<User, UserDocument>{

    constructor(@InjectModel(User.name) protected readonly mongoModel: Model<UserDocument>) {
        super(mongoModel);
    }

    public async getUserByEmail(email: User["email"]): Promise<User> {
        let user = await this.mongoModel.findOne({
            email: email
        })
            .exec()
        return user;
    }

}