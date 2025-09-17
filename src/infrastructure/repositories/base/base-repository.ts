import type { Document, Model } from "mongoose";
import type { IBaseRepository } from "../../../application/interfaces/repository/base-repository.js";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !result;
  }
}
