import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';
import { Image } from './schemas/image.schema';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  private s3: AWS.S3;

  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    private configService: ConfigService,
  ) {
    const awsConfig = this.configService.get('config.aws');

    this.s3 = new AWS.S3({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
    });
  }

  async processAndSaveImage(file: Express.Multer.File, name: string) {
    try {
      const buffer = await sharp(file.buffer).png().toBuffer();

      const filename = `${Date.now()}.png`;

      const uploadParams = {
        Bucket: this.configService.get('config.aws.bucketName'),
        Key: filename,
        Body: buffer,
        ContentType: 'image/png',
      };

      const uploadResult = await this.s3.upload(uploadParams).promise();

      const newImage = new this.imageModel({
        name,
        url: uploadResult.Location,
        uploadDate: new Date(),
      });

      return await newImage.save();
    } catch (error) {
      throw new BadRequestException(
        'Error uploading image to S3: ' + error.message,
      );
    }
  }

  async findImagesByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.imageModel
      .find({
        uploadDate: { $gte: start, $lte: end },
      })
      .exec();
  }

  async getImagesGroupedByHour() {
    return this.imageModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d %H:00:00', date: '$uploadDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
