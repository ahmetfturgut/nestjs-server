import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto, UpdateUserRequestDto } from './dto/create-user.dto';
import { User } from './user.model';
import { ApiException } from '../_common/api/api.exeptions';
import { ApiError } from '../_common/api/api.error';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("createUser")
  async createUser(
    @Body() request: CreateUserRequestDto
  ): Promise<any> {

    if (await this.userService.exists({ email: request.email })) {          
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
  findAll() {
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
