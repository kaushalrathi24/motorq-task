import { IsNotEmpty, IsString } from 'class-validator';

export class ApproveRequestDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
