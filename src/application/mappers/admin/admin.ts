import type { IAdminDTO } from "../../dtos/admin/admin.js";
import type { IUserDocument } from "../../../infrastructure/db/models/user-model.js";

export interface IAdminMapper{
    toAdminDTO(adminDoc: IUserDocument): IAdminDTO
}

export class AdminMapper implements IAdminMapper {
  toAdminDTO(adminDoc: IUserDocument): IAdminDTO {
    return {
      id: adminDoc._id.toString(),
      email: adminDoc.email,
      role: adminDoc.role,
      status: adminDoc.status,
    };
  }
}
