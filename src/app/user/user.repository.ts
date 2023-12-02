import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from './user.model';
import { Repository } from 'src/core/repository/repository';

@Injectable()
export class UserRepository extends Repository<User, UserDocument>{

    constructor(@InjectModel(User.name) protected readonly mongoModel: Model<UserDocument>) {
        super(mongoModel);
    } 

}