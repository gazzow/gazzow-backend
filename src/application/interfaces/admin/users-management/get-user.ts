import type { IGetUserResponseDTO } from "../../../dtos/admin/admin.js";

export interface IGetUserUseCase {
  execute(userId: string): Promise<IGetUserResponseDTO>;
}