import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignRolDto {
  @IsInt({ message: 'El ID del rol debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  id_rol: number;
}
