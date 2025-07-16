export class LoginResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
  };
}
