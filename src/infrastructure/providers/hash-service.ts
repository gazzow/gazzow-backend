import type { IHashService } from "../../application/providers/hash-service.js";
import bcrypt from "bcrypt";

export class HashService implements IHashService {
  private readonly _saltRounds: number;

  constructor(saltRounds: number = 10) {
    this._saltRounds = saltRounds;
  }

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this._saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
