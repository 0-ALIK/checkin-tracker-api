import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignAreaDto {
  @ApiProperty({
    description: 'ID del área a asignar al usuario',
    example: 1,
  })
  @IsInt({ message: 'El ID del área debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del área es requerido' })
  id_area: number;
}
