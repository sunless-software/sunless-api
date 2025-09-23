import { DefaultRole } from "../interfaces";
import { GLOBAL_PERMISSIONS } from "./globalPermissions";
import { PROJECT_PERMISSIONS } from "./projectPermissions";

export const PRODUCTION_DEFAULT_GLOBAL_ROLES: Array<DefaultRole> = [
  {
    id: 1,
    role_name: "ADMIN",
    permissions: Object.values(GLOBAL_PERMISSIONS),
  },
];

export const PRODUCTION_DEFAULT_PROJECT_ROLES = [
  {
    id: 1,
    role_name: "OWNER",
    permissions: Object.values(PROJECT_PERMISSIONS),
  },
];
