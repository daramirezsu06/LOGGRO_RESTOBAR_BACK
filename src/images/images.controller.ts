import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('search')
  async getImagesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('se nececitan fecha de inicio y fin');
    }

    return this.imagesService.findImagesByDateRange(startDate, endDate);
  }

  @Get('grouped-by-hour')
  async getImagesGroupedByHour() {
    return this.imagesService.getImagesGroupedByHour();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
  ) {
    return this.imagesService.processAndSaveImage(file, name);
  }
}
