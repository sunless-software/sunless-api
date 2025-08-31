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
  addTechnologies: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 5,
    name: "ADD_TECHNOLOGIES_PROJECT",
  },
  removeTechnologies: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 6,
    name: "REMOVE_TECHNOLOGIES_PROJECT",
  },
  inviteProject: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 7,
    name: "INVITE_PROJECT",
  },
  createBlogs: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 8,
    name: "CREATE_BLOGS",
  },
  deleteBlogs: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 9,
    name: "DELETE_BLOGS",
  },
  updateBlogs: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 10,
    name: "UPDATE_BLOGS",
  },
  addProjectTags: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 11,
    name: "ADD_PROJECT_TAGS",
  },
  removeProjectTags: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 12,
    name: "REMOVE_PROJECT_TAGS",
  },
  addProjectExternalResources: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 13,
    name: "ADD_PROJECT_EXTERNAL_RESOURCES",
  },
  deleteProjectExternalResources: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 14,
    name: "DELETE_PROJECT_EXTERNAL_RESOURCES",
  },
  updateProjectExternalResources: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 15,
    name: "UPDATE_PROJECT_EXTERNAL_RESOURCES",
  },
  createProjectMedia: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 16,
    name: "CREATE_PROJECT_MEDIA",
  },
  deleteProjectMedia: {
    id: Object.keys(GLOBAL_PERMISSIONS).length + 17,
    name: "DELETE_PROJECT_MEDIA",
  },
} satisfies Record<string, Permission>;
