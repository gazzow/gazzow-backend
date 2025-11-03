import type { IGenerateSignedUrlUseCase } from "../../interfaces/usecase/project/generate-signedurl.js";
import type { IS3FileStorageService } from "../../providers/storage-service.js";

export class GenerateSignedUrlUseCase implements IGenerateSignedUrlUseCase {
  constructor(private _s3FileStorageService: IS3FileStorageService) {}

  async execute(fileKey: string): Promise<string> {
    return await this._s3FileStorageService.generateSignedUrl(fileKey, 600);
  }
}
