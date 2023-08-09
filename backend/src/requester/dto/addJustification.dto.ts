import { IsNotEmpty, IsString } from 'class-validator';

export class AddJustificationDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
