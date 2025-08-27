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
  setPublicProject: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 3,
    name: "SET_PUBLIC_PROJECT",
  },
  setPrivateProject: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 4,
    name: "SET_PRIVATE_PROJECT",
  },
  addTechnologiesProject: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 5,
    name: "ADD_TECHNOLOGIES_PROJECT",
  },
  removeTechnologiesProject: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 6,
    name: "REMOVE_TECHNOLOGIES_PROJECT",
  },
} satisfies Record<string, Permission>;
