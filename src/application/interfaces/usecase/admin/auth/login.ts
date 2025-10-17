import type { IAdminLoginRequestDTO, IAdminLoginResponseDTO } from "../../../../dtos/admin/admin.js";

export interface IAdminLoginUseCase {
  execute(data: IAdminLoginRequestDTO): Promise<IAdminLoginResponseDTO>;
}