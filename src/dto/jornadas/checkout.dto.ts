import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutDto {
  @ApiProperty({
    description: 'ID de la jornada a cerrar',
    example: 1,
  })
  @IsInt({ message: 'El ID de la jornada debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la jornada es requerido' })
  id_jornada: number;

  @ApiProperty({
    description: 'Observaciones opcionales del día de trabajo',
    example: 'Se completaron todas las tareas programadas',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;
}
