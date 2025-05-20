import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service'
import { CacheController } from './cache.controller'

@Module({
    imports: [CacheModule.register({ isGlobal: true, ttl: 2400000})],
    providers: [CacheService],
    controllers: [CacheController],
    exports: [CacheService],
})

export class vCacheModule{}
  
