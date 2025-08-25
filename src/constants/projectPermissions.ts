import { Permission } from "../interfaces";
import { GLOBAL_PERMISSIONS } from "./globalPermissions";

export const PROJECT_PERMISSIONS = {
  updateProjects: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 1,
    name: "UPDATE_PROJECTS",
  },
} satisfies Record<string, Permission>;
