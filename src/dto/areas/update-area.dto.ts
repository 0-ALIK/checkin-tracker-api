import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAreaDto {
  @ApiProperty({
    description: 'Nuevo nombre del área',
    example: 'Contabilidad',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del área debe ser una cadena de texto' })
  nombre_area?: string;
}
