import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  apellido: string;

  @ApiProperty({
    description: 'Email único del usuario',
    example: 'juan.perez@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;

  @ApiProperty({
    description: 'ID del área a la que pertenece el usuario',
    example: 1,
  })
  @IsInt({ message: 'El ID del área debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del área es requerido' })
  id_area: number;

  @ApiProperty({
    description: 'ID del rol asignado al usuario',
    example: 2,
  })
  @IsInt({ message: 'El ID del rol debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  id_rol: number;
}
