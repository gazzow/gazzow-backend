export interface IGenerateSignedUrlUseCase {
  execute(fileKey: string): Promise<string>;
}
