import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignAreaDto {
  @IsInt({ message: 'El ID del área debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del área es requerido' })
  id_area: number;
}
