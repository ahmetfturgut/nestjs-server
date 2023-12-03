import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose"; 
import { Auth, AuthDocument } from './auth.model';
import { AuthType } from './enums/auth.type';
import { AuthState } from './enums/auth.state'; 
import { AuthenticatedUserAuthDto } from './dto/authenticated-user.auth.dto';
import { Repository } from '../_common/repository/repository';
import { User } from '../user/user.model';

@Injectable()
export class AuthRepository extends Repository<Auth, AuthDocument>{

    constructor(@InjectModel(Auth.name) protected readonly mongoModel: Model<AuthDocument>) {
        super(mongoModel);
    }

    public async getAuthenticatedUserAuth(id: Auth["id"]): Promise<AuthenticatedUserAuthDto> {
        let auth = await this.mongoModel.findOne({
            _id: id
        })
            .populate([
                {
                    path: 'user',
                    model: 'User',
                },
            ])
            .exec();

        return AuthenticatedUserAuthDto.from(auth);
    }

    public async updateLastRequestDate(id: Auth["id"]): Promise<void> {
        await this.mongoModel.updateOne({
            _id: id
        }, {
            lastRequestDate: new Date()
        })
            .exec();
    }

    public async getAuthWithPopulatedUser(id: Auth["id"]): Promise<Auth> {
        return await this.mongoModel.findOne({
            _id: id
        })
            .populate("user")
            .exec();
    }


    async doPassiveIfExistsAuth(authType: AuthType, userId?: Auth["userId"]): Promise<void> {
        if (userId) {
            await this.mongoModel.updateMany({
                userId: userId,
                type: authType,
                state: AuthState.ACTIVE
            }, {
                state: AuthState.PASSIVE,
                signOutDate: new Date()
            }).exec();
        } else {
            await this.mongoModel.updateMany({
                type: authType,
                state: AuthState.ACTIVE
            }, {
                state: AuthState.PASSIVE,
                signOutDate: new Date()
            }).exec();
        }
    }
 

    async getUsersLoginCounts(): Promise<Auth[]> {
        var auths = await this.mongoModel.aggregate([
            {
                "$match": {
                    type: AuthType.SIGNIN
                }
            },
            {
                $group:
                {
                    _id: { userId: "$userId" },
                    count: { $sum: 1 }
                }
            }
        ]).exec();

        if (auths != null && auths.length) {
            return auths;
        } else {
            return [];
        }
    }


}