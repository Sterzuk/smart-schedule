import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async send(@Body() dto: ChatMessageDto) {
    const result = await this.chatbotService.handle(dto.message);
    return {
      success: true,
      ...result,
    };
  }
}
