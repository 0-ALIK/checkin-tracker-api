import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CheckinDto {
  @IsInt({ message: 'El ID del supervisor debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del supervisor es requerido' })
  id_supervisor: number;

  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  fecha: string;
}
