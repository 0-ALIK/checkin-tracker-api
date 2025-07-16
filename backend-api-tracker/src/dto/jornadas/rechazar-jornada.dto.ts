import { IsNotEmpty, IsString } from 'class-validator';

export class RechazarJornadaDto {
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El motivo de rechazo es requerido' })
  motivo: string;
}
