import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import controllers from './controllers';
import entities from './entities';
import interceptors from './interceptors';
import * as ormConfig from './ormconfig';
import providers, { AuthMiddleware } from './providers';

dotenv.config();
const env = process.env;

console.log('config', { ...ormConfig, password: '***' });

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature(entities),
    JwtModule.register({ secret: env.JWT_SECRET }),
  ],
  controllers: controllers,
  providers: [...providers, ...interceptors],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
