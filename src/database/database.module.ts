import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const { dbname, username, password, host, port, connection } =
          configService.get('config.mongo');
        return {
          uri: `${connection}://${host}:${port}`,
          dbName: dbname,
          user: username,
          pass: password,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
