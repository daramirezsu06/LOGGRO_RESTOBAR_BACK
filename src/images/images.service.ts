import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';
import { Image } from './schemas/image.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}

  async processAndSaveImage(file: Express.Multer.File, name: string) {
    const buffer = await sharp(file.buffer).png().toBuffer();

    const uploadDir = path.join(__dirname, '../../uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}.png`;
    const filePath = path.join(__dirname, '../../uploads', filename);
    fs.writeFileSync(filePath, buffer);

    const newImage = new this.imageModel({
      name,
      url: filePath,
      uploadDate: new Date(),
    });

    return await newImage.save();
  }
}
