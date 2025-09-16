import type { IGetUserResponseDTO } from "../../../../domain/dtos/admin/admin.js";

export interface IGetUserUseCase {
  execute(id: string): Promise<IGetUserResponseDTO>;
}