import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAreaDto {
  @ApiProperty({
    description: 'Nombre del área',
    example: 'Recursos Humanos',
  })
  @IsString({ message: 'El nombre del área debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del área es requerido' })
  nombre_area: string;
}
