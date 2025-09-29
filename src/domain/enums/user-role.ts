export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export enum Provider {
  LOCAL = "local",
  GOOGLE = "google",
}

export type SortOrder = "asc" | "desc" | 1 | -1;
