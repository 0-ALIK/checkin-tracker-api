import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActividadDto {
  @ApiProperty({
    description: 'ID de la jornada a la que pertenece la actividad',
    example: 1,
  })
  @IsInt({ message: 'El ID de la jornada debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la jornada es requerido' })
  id_jornada: number;

  @ApiProperty({
    description: 'Descripción de la tarea a realizar',
    example: 'Revisar documentos contables del mes',
  })
  @IsString({ message: 'La tarea debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La tarea es requerida' })
  tarea: string;

  @ApiProperty({
    description: 'Meta u objetivo de la actividad',
    example: 'Completar revisión de 50 documentos',
  })
  @IsString({ message: 'La meta debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La meta es requerida' })
  meta: string;

  @ApiProperty({
    description: 'ID del estado actual de la actividad',
    example: 1,
  })
  @IsInt({ message: 'El ID del estado debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del estado es requerido' })
  id_estado: number;

  @ApiProperty({
    description: 'Observaciones adicionales sobre la actividad',
    example: 'Se requiere acceso especial al sistema',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;
}
