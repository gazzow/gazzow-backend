import type { Express } from "express";
import type { IProjectFile } from "../interfaces/s3-bucket/file-storage.js";

export interface IS3FileStorageService {
  uploadFile(file: Express.Multer.File, folder: string): Promise<IProjectFile>;
  uploadFiles(
    files: Express.Multer.File[],
    folder: string
  ): Promise<IProjectFile[]>;
  generateSignedUrl(key: string, expiresIn: number): Promise<string>;
}
