import type { Express } from "express";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type { IS3FileStorageService } from "../../application/providers/storage-service.js";
import type { IProjectFile } from "../../application/interfaces/s3-bucket/file-storage.js";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class S3FileStorageService implements IS3FileStorageService {
  private bucketName = process.env.AWS_BUCKET_NAME!;

  async uploadFile(
    file: Express.Multer.File,
    folder: string = "projects"
  ): Promise<IProjectFile> {
    const fileContent = file.buffer;
    const key = `${folder}/${Date.now()}_${path.basename(file.originalname)}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileContent,
      ContentType: file.mimetype,
    });

    await s3.send(command);
    return { key, name: file.originalname };
  }

  // Upload multiple files
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string = "projects"
  ): Promise<IProjectFile[]> {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map((file) =>
      this.uploadFile(file, folder)
    );
    const uploadedFiles = await Promise.all(uploadPromises);

    return uploadedFiles;
  }

  // Generate signed URL for temporary access
  async generateSignedUrl(
    key: string,
    expiresIn: number = 300
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn });
    return signedUrl;
  }
}
