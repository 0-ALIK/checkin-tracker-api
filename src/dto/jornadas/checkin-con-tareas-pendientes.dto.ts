import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CheckinDto } from './checkin.dto';

export class CheckinConTareasPendientesDto {
  @ApiProperty({ 
    description: 'Datos del check-in',
    type: CheckinDto
  })
  @ValidateNested()
  @Type(() => CheckinDto)
  checkinDto: CheckinDto;

  @ApiProperty({ 
    description: 'IDs de las tareas pendientes a arrastrar',
    type: [Number],
    example: [1, 3, 5],
    required: false
  })
  @IsOptional()
  @IsArray()
  tareasArrastradas?: number[];
}
