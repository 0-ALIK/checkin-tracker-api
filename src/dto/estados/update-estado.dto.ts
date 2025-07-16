import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEstadoDto {
  @ApiProperty({
    description: 'Nuevo nombre del estado de la actividad',
    example: 'Completado',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del estado debe ser una cadena de texto' })
  nombre_estado?: string;
}
