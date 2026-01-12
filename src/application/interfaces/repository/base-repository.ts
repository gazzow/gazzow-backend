import type { FilterQuery } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(query: {
    filter?: FilterQuery<T>;
    skip?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filter: FilterQuery<T>): Promise<number>;
}
