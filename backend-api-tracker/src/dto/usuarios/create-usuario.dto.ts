import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  apellido: string;

  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;

  @IsInt({ message: 'El ID del área debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del área es requerido' })
  id_area: number;

  @IsInt({ message: 'El ID del rol debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  id_rol: number;
}
