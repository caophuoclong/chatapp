import { Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9_@.#&^+-]{8,}$/, {
    message:
      'New password must contain at least 8 characters, one uppercase, one lowercase, one number',
  })
  newPassword: string;
  @ApiProperty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9_@.#&^+-]{8,}$/, {
    message:
      'Old password must contain at least 8 characters, one uppercase, one lowercase, one number',
  })
  oldPassword: string;
}
