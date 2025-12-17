import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsUrl } from "class-validator";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  @IsString()
  @IsNotEmpty({ message: "Le nom d'utilisateur est obligatoire" })
  username!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email!: string;

  @Column({ type: "varchar", length: 255, select: false })
  @MinLength(8, { message: "Le mot de passe doit faire au moins 8 caractères" })
  password!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  @IsOptional()
  @IsUrl({}, { message: "L'avatar doit être une URL valide" })
  avatar!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
