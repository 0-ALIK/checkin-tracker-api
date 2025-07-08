import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  apellido?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña?: string;

  @IsOptional()
  @IsInt({ message: 'El ID del área debe ser un número entero' })
  id_area?: number;

  @IsOptional()
  @IsInt({ message: 'El ID del rol debe ser un número entero' })
  id_rol?: number;
}
