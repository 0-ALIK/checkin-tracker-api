import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckinDto {
  @ApiProperty({
    description: 'ID del supervisor que supervisa la jornada',
    example: 3,
  })
  @IsInt({ message: 'El ID del supervisor debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del supervisor es requerido' })
  id_supervisor: number;

  @ApiProperty({
    description: 'Fecha de la jornada laboral',
    example: '2024-01-15',
    format: 'date',
  })
  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  fecha: string;
}
