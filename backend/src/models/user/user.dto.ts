import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsInt,
  Min,
} from 'class-validator';
import { UserEntity } from './user.entity';

export class UserRequestDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsInt({ message: "L'âge doit être un entier" })
  @Min(0, { message: "L'âge doit être positif" })
  age?: number;

  @IsOptional()
  @IsUrl({}, { message: "L'avatar doit être une URL valide" })
  avatar?: string;
}

export class UserResponseDto {
  id!: string;
  username!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  age!: number | null;
  isActive!: boolean;
  avatar!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(entity: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.username = entity.username;
    dto.email = entity.email;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.age = entity.age ?? null;
    dto.isActive = entity.isActive;
    dto.avatar = entity.avatar || null;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    return dto;
  }
}

export class LoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsBoolean({ message: 'La valeur doit être un booléen' })
  rememberMe?: boolean = false;
}

export class UserProfilResponse {
  id!: string;
  username!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  age!: number | null;
  avatar!: string | null;
  isActive!: boolean;
  stats?: {
    roadmaps: number;
    followers: number;
    following: number;
  };

  static fromEntity(
    entity: UserEntity,
    stats?: { roadmaps: number },
  ): UserProfilResponse {
    const dto = new UserProfilResponse();
    dto.id = entity.id;
    dto.username = entity.username;
    dto.email = entity.email;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.age = entity.age ?? null;
    dto.avatar = entity.avatar || null;
    dto.isActive = entity.isActive;

    if (stats) {
      dto.stats = {
        roadmaps: stats.roadmaps,
        followers: 0, // Placeholder
        following: 0, // Placeholder
      };
    }

    return dto;
  }
}
