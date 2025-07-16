import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateActividadDto {
  @IsOptional()
  @IsString({ message: 'La tarea debe ser una cadena de texto' })
  tarea?: string;

  @IsOptional()
  @IsString({ message: 'La meta debe ser una cadena de texto' })
  meta?: string;

  @IsOptional()
  @IsInt({ message: 'El ID del estado debe ser un número entero' })
  id_estado?: number;

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;
}
