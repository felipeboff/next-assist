export const userRoles = ["employee", "analyst"] as const;

export type UserRole = (typeof userRoles)[number];
