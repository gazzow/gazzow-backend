import type { ITokenPayload } from "../application/interfaces/jwt/jwt-payload.ts";

declare global {
  namespace Express {
    interface User extends ITokenPayload {
      isNewUser?: boolean;
    }

    interface Request {
      user?: User;
    }
  }
}
