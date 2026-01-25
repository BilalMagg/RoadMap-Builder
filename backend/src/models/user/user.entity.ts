import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUrl,
} from "class-validator";
import { RefreshTokenEntity } from "../refreshToken/refreshToken.entity";
import { RoadmapProgressEntity } from "../roadmap_progress/roadmap_progress.entity";

@Entity("users")
export class UserEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 50 ,default: "Unknown"})
  firstName!: string;

  @Column({ type: "varchar", length: 50 ,default: "Unknown"})
  lastName!: string;

  @Column({ type: "int", nullable: true })
  age?: number;


  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "varchar", length: 50, unique: true })
  @IsString({ message: "Username must be a string" })
  @IsNotEmpty({ message: "Username is required" })
  username!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string; 

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  @IsOptional()
  @IsUrl({}, { message: "Avatar must be a valid URL" })
  avatar!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens!: RefreshTokenEntity[];
  
  @OneToMany(() => RoadmapProgressEntity, (progress) => progress.user)
  progress!: RoadmapProgressEntity[];

  @UpdateDateColumn()
  updatedAt!: Date;
}
