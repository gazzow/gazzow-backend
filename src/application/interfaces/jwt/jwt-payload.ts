import type { UserRole } from "../../../domain/enums/user-role.js";

export interface ITokenPayload {
    id?: string | undefined,
    email: string,
    role: UserRole,
}
