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
import { UserState } from './enum/user.state';
import { AuthService } from '../auth/auth.service';
import { AuthendicatedUserInfoResponseDto, SignInResponseDto, VerifySignInResponseDto } from './dto/user.response.dto';
import { SignInRequestDto, VerifySignInRequestDto } from './dto/users.request.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }

  @Public()
  @Post("createUser")
  async createUser(
    @Body() request: CreateUserRequestDto
  ): Promise<any> {

    this.logger.debug('started createUser()', UserController.name);

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


  @Public()
  @Post("signIn")
  async signIn(
    @Body() request: SignInRequestDto
  ): Promise<SignInResponseDto> {

    this.logger.debug('started signIn() ', UserController.name);

    let user = await this.userService.getUserByEmail(request.email);
    if (!user) {
      this.logger.error('user not found. wrong email');
      throw ApiException.buildFromApiError(ApiError.WRONG_EMAIL_OR_PASSWORD);
    }

    if (user.state != UserState.ACTIVE) {
      this.logger.error('unverified user');
      throw ApiException.buildFromApiError(ApiError.WRONG_EMAIL_OR_PASSWORD);
    }

    let isValidPassword = this.authService.validateUserPassword(user, request.password)

    if (!isValidPassword) {
      this.logger.debug("User password not validated.");
      throw ApiException.buildFromApiError(ApiError.WRONG_EMAIL_OR_PASSWORD);
    }

    let auth = await this.authService.createVerifySignInToken(user);
    this.logger.debug("authId: ", auth.id);

    console.log("verification code: " + auth.verificationCode);

    // let email = new CodeEmail();
    // email.verificationMailValidityPeriod = converMilliSecondtoMinute(expiresTimeConfig.verifySignInExpiresIn);
    // email.code = auth.verificationCode;
    // await this.emailService.sendMail(new EmailBuilder(email, user.lang)
    //   .setTo(user.email)
    // );

    var response = new SignInResponseDto();
    response.token = auth.token;
    this.logger.debug("signIn done.");
    return response;
  }

  @Public()
  @Post("verifySignIn")
  async verifySignIn(
    @Body() request: VerifySignInRequestDto
  ): Promise<VerifySignInResponseDto> {

    this.logger.debug('started verifySignIn() ', UserController.name);

    let auth = await this.authService.verifySignInToken(request.token, request.verificationCode);
    let user = await this.userService.findById(auth.userId);

    let response = new VerifySignInResponseDto();
    let accessToken = await this.authService.createSignInToken(user);
    response.accessToken = accessToken.token;
    response.authendicatedUser = new AuthendicatedUserInfoResponseDto();
    response.authendicatedUser.id = user.id;
    response.authendicatedUser.email = user.email;
    response.authendicatedUser.type = user.type;
    response.authendicatedUser.name = user.name;
    response.authendicatedUser.surname = user.surname;
    response.authendicatedUser.isSystemUSer = (user.type == UserType.SYSTEM_USER);
    user.lastLoginDate = new Date();

    await this.userService.update(user);

    this.logger.debug("verifySignIn done.");
    return response;
  }


  @Get('getAllUser')
  @UserTypes(UserType.SYSTEM_USER)//for Admin
  getAllUser() {
    return this.userService.findAll();
  }
 
  @Post("updateUser")
  async updateUser(@Body() request: UpdateUserRequestDto) {

    let user = await this.userService.findById(request.id);
    user.name = request.name;
    user.surname = request.surname;
    return this.userService.update(user);
  }

}
