import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TareaDto {
  @ApiProperty({ description: 'Descripción de la tarea', example: 'Revisar documentos' })
  @IsString()
  tarea: string;

  @ApiProperty({ description: 'Meta de la tarea', example: 'Completar revisión antes del mediodía' })
  @IsString()
  meta: string;

  @ApiProperty({ description: 'Observaciones adicionales', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class CheckinDto {
  @ApiProperty({ description: 'Fecha del check-in', example: '2024-01-15T08:00:00.000Z' })
  @IsString()
  fecha: string;

  @ApiProperty({ description: 'Comentario general del día', required: false })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiProperty({ 
    description: 'Lista de tareas planificadas', 
    type: [TareaDto],
    example: [
      { tarea: 'Revisar emails', meta: 'Responder todos los pendientes' },
      { tarea: 'Reunión de equipo', meta: 'Planificar sprint' },
      { tarea: 'Actualizar documentación', meta: 'Documentar nuevas funcionalidades' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TareaDto)
  tareas: TareaDto[];
}
