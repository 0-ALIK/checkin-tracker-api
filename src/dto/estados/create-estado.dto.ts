import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstadoDto {
  @ApiProperty({
    description: 'Nombre del estado de la actividad',
    example: 'En Progreso',
  })
  @IsString({ message: 'El nombre del estado debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del estado es requerido' })
  nombre_estado: string;
}
