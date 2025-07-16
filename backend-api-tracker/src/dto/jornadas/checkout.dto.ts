import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @IsInt({ message: 'El ID de la jornada debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la jornada es requerido' })
  id_jornada: number;

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;
}
