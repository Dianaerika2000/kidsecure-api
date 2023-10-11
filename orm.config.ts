import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  database: configService.get('DB_DATABASE'),
  entities: ['src/**/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
