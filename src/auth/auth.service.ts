import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto) {
    try{

      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      user.password = "****";

      return {
        ...user,
        token: this.getJwtToken({email: user.email, id: user.id}),
      };

    }catch(error){
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto){
    const { password, email} = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { email},
      select: {email: true, password: true, id: true},
    });

    if(!user){
      throw new UnauthorizedException("Credentials are not valid")
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException("Credentials are not valid.")
    }

    user.password = "****";

    return {
      ...user,
      token: this.getJwtToken({email: user.email , id: user.id})
    };
  
  }

  async user(authUserDto: AuthUserDto){
    const { email} = authUserDto;

    //TODO: Revisar que este authorizado el usuario antes de continuar

    const user = await this.userRepository.findOne({ 
      where: { email},
    });

    if(!user){
      throw new NotFoundException("User not found");
    }

    user.password = "****";

    return {
      ...user,
    };
  
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
  
  private handleDBErrors(error: any): never {

    //Error de llave duplicada
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');

  }
}
