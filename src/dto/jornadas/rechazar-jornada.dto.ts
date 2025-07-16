import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RechazarJornadaDto {
  @ApiProperty({
    description: 'Motivo del rechazo de la jornada',
    example: 'Las actividades no cumplen con los estándares requeridos',
  })
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El motivo de rechazo es requerido' })
  motivo: string;
}
