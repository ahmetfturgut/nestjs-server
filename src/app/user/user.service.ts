import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User, UserDocument } from './user.model';
import { Service } from 'src/core/service/service';

@Injectable()
export class UserService extends Service<User, UserDocument, UserRepository> {

  constructor(
    protected repository: UserRepository,
  ) {
    super(repository);
  }

}
