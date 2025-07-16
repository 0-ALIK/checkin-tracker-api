import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRolDto {
  @ApiProperty({
    description: 'Nuevo nombre del rol',
    example: 'Gerente',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  nombre_rol?: string;
}
