import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRolDto {
  @ApiProperty({
    description: 'ID del rol a asignar al usuario',
    example: 2,
  })
  @IsInt({ message: 'El ID del rol debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  id_rol: number;
}
