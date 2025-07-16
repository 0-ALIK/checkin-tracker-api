import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateActividadDto {
  @IsInt({ message: 'El ID de la jornada debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la jornada es requerido' })
  id_jornada: number;

  @IsString({ message: 'La tarea debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La tarea es requerida' })
  tarea: string;

  @IsString({ message: 'La meta debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La meta es requerida' })
  meta: string;

  @IsInt({ message: 'El ID del estado debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del estado es requerido' })
  id_estado: number;

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;
}
