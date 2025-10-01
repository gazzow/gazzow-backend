import type { IUserBlockResponseDTO } from "../../../dtos/admin/admin.js";
import type { UserStatus } from "../../../../domain/enums/user-role.js";

export interface IBlockUserUseCase {
  execute(userId: string, status: UserStatus): Promise<IUserBlockResponseDTO>;
}