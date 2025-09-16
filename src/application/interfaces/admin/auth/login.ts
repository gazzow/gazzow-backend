import type { IAdminLoginResponseDTO } from "../../../../domain/dtos/admin/admin.js";

export interface IAdminLoginUseCase {
  execute(email: string, password: string): Promise<IAdminLoginResponseDTO>;
}