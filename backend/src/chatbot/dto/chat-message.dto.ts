import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatMessageDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Сообщение должно быть строкой' })
  @IsNotEmpty({ message: 'Сообщение не может быть пустым' })
  @MaxLength(500, { message: 'Сообщение не должно быть длиннее 500 символов' })
  message!: string;
}
