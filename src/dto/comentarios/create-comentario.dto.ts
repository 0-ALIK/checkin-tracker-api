import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateComentarioDto {
  @IsInt({ message: 'El ID de la actividad debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la actividad es requerido' })
  id_actividad: number;

  @IsString({ message: 'El comentario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El comentario es requerido' })
  comentario: string;
}
