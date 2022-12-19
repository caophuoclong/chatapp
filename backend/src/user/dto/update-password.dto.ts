import { Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty()

  newPassword: string;
  @ApiProperty()

  oldPassword: string;
}
