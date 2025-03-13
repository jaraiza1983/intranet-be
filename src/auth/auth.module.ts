import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    
    ConfigModule,
    
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule],
      inject: [ ConfigService],
      useFactory: ( configService: ConfigService) => {
        //console.log('JWT SECRET', process.env.JWT_SECRET)
        console.log('JWT SECRET', configService.get('JWT_SECRET'))
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '20m',
          }
        }
      }
    }),
  ],
  exports: [
    TypeOrmModule, //Para poder utilizar los modelos en otros modulos
    JwtStrategy, //Para poder evaluar el JWT en otros modulos
    PassportModule,
    JwtModule,
  ]
})
export class AuthModule {}
