import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  apellido?: string;

  @ApiProperty({
    description: 'Email único del usuario',
    example: 'juan.perez@example.com',
    format: 'email',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: 'newpassword123',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña?: string;

  @ApiProperty({
    description: 'ID del área a la que pertenece el usuario',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El ID del área debe ser un número entero' })
  id_area?: number;

  @ApiProperty({
    description: 'ID del rol asignado al usuario',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El ID del rol debe ser un número entero' })
  id_rol?: number;
}
