import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/app/user/enum/usertype.enum';

export const UserTypes = (...usertypes: UserType[]) => SetMetadata('userTypes', usertypes);