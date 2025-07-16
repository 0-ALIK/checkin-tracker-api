<<<<<<< HEAD
import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  apellido: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario',
    type: UserDto,
  })
  user: UserDto;
=======
export class LoginResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    id_rol?:number;
  };
>>>>>>> 3f5288aaf0f1d3280281adac006bebc5f808ee62
}
