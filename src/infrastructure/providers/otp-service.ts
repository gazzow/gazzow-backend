import { env } from "../config/env.js";
import { Redis } from "ioredis";
import type { IOtpStore } from "../../application/providers/otp-service.js";

const REDIS_URL = env.redis_url as string;

const redis = new Redis(REDIS_URL);

if (!redis) throw new Error("Redis not connected❌");

export class OtpStore implements IOtpStore {
  async set(key: string, hashedOtp: string, ttlSeconds: number): Promise<void> {
    await redis.set(key, hashedOtp, "EX", ttlSeconds);
  }

  async get(key: string): Promise<string | null> {
    return await redis.get(key);
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }
}
