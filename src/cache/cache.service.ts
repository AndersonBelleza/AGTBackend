import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import puppeteer from 'puppeteer'
import { VertexAI } from "@google-cloud/vertexai";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: any): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
      await this.cacheManager.reset();
  }

}