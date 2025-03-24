import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){

  }

  async create(createUserDto: CreateUserDto) {
    
    try {
      
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      user.password = "****";

      return user;

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {

    const { limit =10, offset=0} = paginationDto;

    try {
      const users: User[] = await this.userRepository.find({
        take: limit,
        skip: offset,
      });      
      return users;
    } catch (error) {
      this.handleDBErrors(error);
    }    
    

  }

  async findOne(term: string) {
    
    let user: User | null;

    if(isUUID(term)){
      user = await this.userRepository.findOneBy({id: term});
    } else {
      //user = await this.userRepository.findOneBy({email: term});
      const queryBuilder = this.userRepository.createQueryBuilder();
      user = await queryBuilder.where('email =:email',{
        email: term.toLowerCase(),
      }).getOne();
    }
    
    if(!user){
      throw new NotFoundException(`User with  ${ term }, not found`);
    } 

    return user;
    
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto
    });

    if(!user){
      throw new NotFoundException(`User ${ id } not found `);
    }

    await this.userRepository.save(user);

    //Avoid sending password
    user.password = "***";

    return user;

  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  handleDBErrors(error){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    this.logger.log(error);
    throw new InternalServerErrorException("Unknow error, please contact admin");
  }
}
