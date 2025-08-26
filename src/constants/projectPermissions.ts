import { Permission } from "../interfaces";
import { GLOBAL_PERMISSIONS } from "./globalPermissions";

export const PROJECT_PERMISSIONS = {
  updateProjects: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 1,
    name: "UPDATE_PROJECTS",
  },
  deleteProject: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 2,
    name: "DELETE_PROJECT",
  },
} satisfies Record<string, Permission>;
