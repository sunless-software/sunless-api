import { GLOBAL_PERMISSIONS } from "./globalPermissions";

export const DEVELOPMENT_GLOBAL_ROLES = [
  {
    id: 1,
    name: "admin",
    permissions: [
      GLOBAL_PERMISSIONS.createUsers,
      GLOBAL_PERMISSIONS.updateUsers,
      GLOBAL_PERMISSIONS.deleteUsers,
      GLOBAL_PERMISSIONS.recoverUsers,
      GLOBAL_PERMISSIONS.updateOwnUser,
      GLOBAL_PERMISSIONS.banUsers,
      GLOBAL_PERMISSIONS.unbanUsers,
      GLOBAL_PERMISSIONS.viewPrivateUsers,
      GLOBAL_PERMISSIONS.viewBannedUsers,
      GLOBAL_PERMISSIONS.viewDeletedUsers,
      GLOBAL_PERMISSIONS.createPublicProjects,
      GLOBAL_PERMISSIONS.inviteToOwnedProjects,
      GLOBAL_PERMISSIONS.inviteProjects,
      GLOBAL_PERMISSIONS.updateProjects,
      GLOBAL_PERMISSIONS.deleteProjects,
      GLOBAL_PERMISSIONS.viewPrivateProjects,
      GLOBAL_PERMISSIONS.viewPrivateBlogs,
      GLOBAL_PERMISSIONS.createBlogs,
      GLOBAL_PERMISSIONS.updateBlogs,
      GLOBAL_PERMISSIONS.deleteBlogs,
    ],
  },
  {
    id: 2,
    name: "client",
    permissions: [],
  },
  {
    id: 3,
    name: "user",
    permissions: [
      GLOBAL_PERMISSIONS.updateOwnUser,
      GLOBAL_PERMISSIONS.createPublicProjects,
      GLOBAL_PERMISSIONS.inviteToOwnedProjects,
    ],
  },
];

export const DEVELOPMENT_USERS = [
  {
    id: 1,
    username: "sunless_admin",
    password: "Password123!",
    role_id: 1,
  },
  {
    id: 2,
    username: "sunless_client",
    password: "Password123!",
    role_id: 2,
  },
  {
    id: 3,
    username: "sunless_user",
    password: "Password123!",
    role_id: 3,
  },
];
