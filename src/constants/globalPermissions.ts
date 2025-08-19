import { Permission } from "../interfaces";

export const GLOBAL_PERMISSIONS = {
  createUsers: { id: 1, name: "CREATE_USERS", scope: "GLOBAL" },
  updateUsers: { id: 2, name: "UPDATE_USERS", scope: "GLOBAL" },
  deleteUsers: { id: 3, name: "DELETE_USERS", scope: "GLOBAL" },
  recoverUsers: { id: 4, name: "RECOVER_USERS", scope: "GLOBAL" },
  updateOwnUser: { id: 5, name: "UPDATE_OWN_USER", scope: "GLOBAL" },
  banUsers: { id: 6, name: "BAN_USERS", scope: "GLOBAL" },
  unbanUsers: { id: 7, name: "UNBAN_USERS", scope: "GLOBAL" },
  viewPrivateUsers: {
    id: 8,
    name: "VIEW_PRIVATE_USERS",
    scope: "GLOBAL",
  },
  viewBannedUsers: {
    id: 9,
    name: "VIEW_BANNED_USERS",
    scope: "GLOBAL",
  },
  viewDeletedUsers: {
    id: 10,
    name: "VIEW_DELETED_USERS",
    scope: "GLOBAL",
  },
  createPublicProjects: {
    id: 11,
    name: "CREATE_PUBLIC_PROJECTS",
    scope: "GLOBAL",
  },
  inviteToOwnedProjects: {
    id: 12,
    name: "INVITE_TO_OWNED_PROJECTS",
    scope: "GLOBAL",
  },
  inviteProjects: { id: 13, name: "INVITE_PROJECTS", scope: "GLOBAL" },
  updateProjects: { id: 14, name: "UPDATE_PROJECTS", scope: "GLOBAL" },
  deleteProjects: { id: 15, name: "DELETE_PROJECTS", scope: "GLOBAL" },
  viewPrivateProjects: {
    id: 16,
    name: "VIEW_PRIVATE_PROJECTS",
    scope: "GLOBAL",
  },
  viewPrivateBlogs: {
    id: 17,
    name: "VIEW_PRIVATE_BLOGS",
    scope: "GLOBAL",
  },
  createBlogs: { id: 18, name: "CREATE_BLOGS", scope: "GLOBAL" },
  updateBlogs: { id: 19, name: "UPDATE_BLOGS", scope: "GLOBAL" },
  deleteBlogs: { id: 20, name: "DELETE_BLOGS", scope: "GLOBAL" },
  manageUserRoles: { id: 21, name: "MANAGE_USER_ROLES", scope: "GLOBAL" },
  createOwnExperiences: {
    id: 22,
    name: "CREATE_OWN_EXPERIENCES",
    scope: "GLOBAL",
  },
  createExperiences: { id: 23, name: "CREATE_EXPERIENCES", scope: "GLOBAL" },
  deleteOwnExperiences: {
    id: 24,
    name: "DELETE_OWN_EXPERIENCES",
    scope: "GLOBAL",
  },
  deleteExperiences: {
    id: 25,
    name: "DELETE_EXPERIENCES",
    scope: "GLOBAL",
  },
  updateOwnExperiences: {
    id: 26,
    name: "UPDATE_OWN_EXPERIENCES",
    scope: "GLOBAL",
  },
  updateExperiences: {
    id: 27,
    name: "UPDATE_EXPERIENCES",
    scope: "GLOBAL",
  },
  createOwnEducations: {
    id: 28,
    name: "CREATE_OWN_EDUCATIONS",
    scope: "GLOBAL",
  },
  createEducations: {
    id: 29,
    name: "CREATE_EDUCATIONS",
    scope: "GLOBAL",
  },
} satisfies Record<string, Permission>;
