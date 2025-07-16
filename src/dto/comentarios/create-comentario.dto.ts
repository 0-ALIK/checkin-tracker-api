import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComentarioDto {
  @ApiProperty({
    description: 'ID de la actividad sobre la cual se comenta',
    example: 1,
  })
  @IsInt({ message: 'El ID de la actividad debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la actividad es requerido' })
  id_actividad: number;

  @ApiProperty({
    description: 'Comentario del supervisor sobre la actividad',
    example: 'Buen trabajo, pero se puede mejorar la eficiencia',
  })
  @IsString({ message: 'El comentario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El comentario es requerido' })
  comentario: string;
}
