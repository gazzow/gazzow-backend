import type { IGetUserResponseDTO } from "../../../dtos/admin/admin.js";

export interface IGetUserUseCase {
  execute(id: string): Promise<IGetUserResponseDTO>;
}