import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Post('user')
  @UseGuards( AuthGuard() )
  getAuthUser(
    @Body() authUserDto: AuthUserDto, 
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
  ){
    return this.authService.user(authUserDto);
  }

  @Get('test')
  @UseGuards( AuthGuard(), UserRoleGuard )
  @SetMetadata('roles', ['admin','super-user'])
  getAuthUserTest(

  ) {
    return {hola: "mundo"}
  }
}
