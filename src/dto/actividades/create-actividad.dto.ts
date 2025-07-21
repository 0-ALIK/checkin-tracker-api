import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActividadDto {
  @ApiProperty({ description: 'ID de la jornada' })
  @IsNumber()
  @IsNotEmpty()
  id_jornada: number;

  @ApiProperty({ description: 'Nombre de la tarea' })
  @IsString()
  @IsNotEmpty()
  tarea: string;

  @ApiProperty({ description: 'Meta de la actividad' })
  @IsString()
  @IsNotEmpty()
  meta: string;

  @ApiProperty({ description: 'Observaciones', required: false })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiProperty({ description: 'ID del estado', required: false })
  @IsNumber()
  @IsOptional()
  id_estado?: number;
}
