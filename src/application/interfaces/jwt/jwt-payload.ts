import type { UserRole } from "../../../domain/enums/user-role.js";

export interface ITokenPayload {
    id: string,
    email: string,
    role: UserRole,
}
