import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional,IsBoolean, IsUrl } from 'class-validator';
import { UserEntity } from './user.entity';

export class UserRequestDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8, { message: "Le mot de passe est trop court" })
  password!: string;
}

export class UserResponseDto {
  id!: string;
  username!: string;
  email!: string;
  avatar!: string | null;
  createdAt!: Date;


  static fromEntity(entity: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.username = entity.username;
    dto.email = entity.email;
    dto.avatar = entity.avatar || null;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}

export class LoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8, { message: "Le mot de passe est trop court" })
  password!: string;


  @IsOptional()
  @IsBoolean({ message: "La valeur doit être un booléen" })
  rememberMe?: boolean = false; 
}