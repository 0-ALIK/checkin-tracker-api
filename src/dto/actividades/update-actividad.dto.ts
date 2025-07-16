import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateActividadDto {
  @ApiProperty({
    description: 'Nueva descripción de la tarea',
    example: 'Revisar y aprobar documentos contables del mes',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La tarea debe ser una cadena de texto' })
  tarea?: string;

  @ApiProperty({
    description: 'Nueva meta u objetivo de la actividad',
    example: 'Completar revisión de 75 documentos',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La meta debe ser una cadena de texto' })
  meta?: string;

  @ApiProperty({
    description: 'Nuevo ID del estado de la actividad',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El ID del estado debe ser un número entero' })
  id_estado?: number;

  @ApiProperty({
    description: 'Nuevas observaciones sobre la actividad',
    example: 'Progreso del 60% completado',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;
}
