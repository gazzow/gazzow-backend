import type { IAdminLoginRequestDTO, IAdminLoginResponseDTO } from "../../../../domain/dtos/admin/admin.js";

export interface IAdminLoginUseCase {
  execute(data: IAdminLoginRequestDTO): Promise<IAdminLoginResponseDTO>;
}