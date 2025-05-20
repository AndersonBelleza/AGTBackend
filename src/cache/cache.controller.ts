import { Controller, Get, Post, Body, Query, Param, Req } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller("Cache")
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Post('cache/set')
  async setCache(@Body() body: { key: string; value: any }, @Req() req: Request): Promise<string> {
    await this.cacheService.set(body.key, body.value);
    return 'Valor creado en caché...';
  }
}