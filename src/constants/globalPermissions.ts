import { Permission } from "../interfaces";

export const GLOBAL_PERMISSIONS = {
  createUsers: { id: 1, name: "CREATE_USERS", scope: "GLOBAL" },
  updateUsers: { id: 2, name: "UPDATE_USERS", scope: "GLOBAL" },
  deleteUsers: { id: 3, name: "DELETE_USERS", scope: "GLOBAL" },
  updateOwnUser: { id: 4, name: "UPDATE_OWN_USER", scope: "GLOBAL" },
  banUsers: { id: 5, name: "BAN_USERS", scope: "GLOBAL" },
  viewPrivateUsers: {
    id: 6,
    name: "VIEW_PRIVATE_USERS",
    scope: "GLOBAL",
  },
  viewBannedUsers: {
    id: 7,
    name: "VIEW_BANNED_USERS",
    scope: "GLOBAL",
  },
  viewDeletedUsers: {
    id: 8,
    name: "VIEW_DELETED_USERS",
    scope: "GLOBAL",
  },
  createPublicProjects: {
    id: 9,
    name: "CREATE_PUBLIC_PROJECTS",
    scope: "GLOBAL",
  },
  inviteToOwnedProjects: {
    id: 10,
    name: "INVITE_TO_OWNED_PROJECTS",
    scope: "GLOBAL",
  },
  inviteProjects: { id: 11, name: "INVITE_PROJECTS", scope: "GLOBAL" },
  updateProjects: { id: 12, name: "UPDATE_PROJECTS", scope: "GLOBAL" },
  deleteProjects: { id: 13, name: "DELETE_PROJECTS", scope: "GLOBAL" },
  viewPrivateProjects: {
    id: 14,
    name: "VIEW_PRIVATE_PROJECTS",
    scope: "GLOBAL",
  },
  viewPrivateBlogs: {
    id: 15,
    name: "VIEW_PRIVATE_BLOGS",
    scope: "GLOBAL",
  },
  createBlogs: { id: 16, name: "CREATE_BLOGS", scope: "GLOBAL" },
  updateBlogs: { id: 17, name: "UPDATE_BLOGS", scope: "GLOBAL" },
  deleteBlogs: { id: 18, name: "DELETE_BLOGS", scope: "GLOBAL" },
} satisfies Record<string, Permission>;
