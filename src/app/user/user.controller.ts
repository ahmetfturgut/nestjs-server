import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto, UpdateUserRequestDto } from './dto/create-user.dto';
import { User } from './user.model';
import { ApiException } from '../_common/api/api.exeptions';
import { ApiError } from '../_common/api/api.error';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserTypes } from 'src/core/decorators/user-type.decorator';
import { UserType } from './enum/usertype.enum';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }

  @Public()
  @Post("createUser")
  async createUser(
    @Body() request: CreateUserRequestDto
  ): Promise<any> {

    this.logger.warn('started createUser()', UserController.name);

    if (await this.userService.exists({ email: request.email })) {
      this.logger.error('email exist! ' + request.email);
      throw ApiException.buildFromApiError(ApiError.USER_EMAIL_EXISTS);
    }

    let newUser = new User();
    newUser.email = request.email;
    newUser.name = request.name;
    newUser.surname = request.surname;
    newUser.password = request.password;

    return this.userService.save(newUser);
  }


  @Get()
  @UserTypes(UserType.SYSTEM_USER)//for Admin
  getAllUser() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post("updateUser")
  async updateUser(@Body() request: UpdateUserRequestDto) {

    let user = await this.userService.findById(request.id);
    user.name = request.name;
    user.surname = request.surname;
    return this.userService.update(user);
  }

}
