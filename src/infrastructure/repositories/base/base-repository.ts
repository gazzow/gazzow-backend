import type { FilterQuery, Model } from "mongoose";
import type { IBaseRepository } from "../../../application/interfaces/repository/base-repository.js";

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(query: {
    filter?: FilterQuery<T>;
    skip?: number;
    limit?: number;
  }): Promise<T[]> {
    const { filter = {}, skip = 0, limit = 10 } = query;

    return await this.model.find(filter).skip(skip).limit(limit).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !result;
  }
}
