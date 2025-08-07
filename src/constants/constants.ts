import { Permission } from "../interfaces";

export const NODE_ENV_DEVELOPMENT = "development";

export const HTTP_STATUS_CODE_OK = 200;
export const HTTP_STATUS_CODE_CREATED = 201;
export const HTTP_STATUS_CODE_UNAUTHORIZED = 401;
export const HTTP_STATUS_CODE_FORBIDDEN = 403;
export const HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR = 500;
export const HTTP_STATUS_CODE_BAD_REQUEST = 400;
export const HTTP_STATUS_CODE_CONFLICT = 409;

export const PG_UNIQUE_VIOLATION_CODE = "23505";
export const PG_FOREIGN_KEY_VIOLATION_CODE = "23503";

export const ERROR_TYPE_CREATE_USER = "CREATE_USER_ERROR";

export enum Entities {
  MEDIA_TYPES = "media_tpyes",
  TAGS = "tags",
  PROJECTS = "projects",
  PROJECT_TAGS = "project_tags",
  GLOBAL_ROLES = "global_roles",
  USERS = "users",
  EDUCATION = "education",
  SKILLS = "skills",
  USERS_SKILLS = "users_skills",
  PERMISSIONS = "permissions",
  GLOBAL_ROLE_PERMISSIONS = "global_role_permissions",
  PROJECT_ROLES = "project_roles",
  COLLABORATORS = "collaborators",
  EXPERIENCES = "experiences",
  TECHNOLOGIES = "technologies",
  PROJECTS_TECHNOLOGIES = "projects_technologies",
  PROJECT_ROLE_PERMISSIONS = "project_role_permissions",
  EXTERNAL_RESOURCES = "external_resources",
  USERS_TECHNOLOGIES = "users_technologies",
  PROJECTS_MEDIA = "projects_media",
  BLOGS = "blogs",
  BLOGS_MEDIA = "blogs_media",
}

export const PERMISSIONS = {
  createUsersGlobal: { id: 1, name: "CREATE_USERS", scope: "GLOBAL" },
  updateUsersGlobal: { id: 2, name: "UPDATE_USERS", scope: "GLOBAL" },
  deleteUsersGlobal: { id: 3, name: "DELETE_USERS", scope: "GLOBAL" },
  updateOwnUserGlobal: { id: 4, name: "UPDATE_OWN_USER", scope: "GLOBAL" },
  banUsersGlobal: { id: 5, name: "BAN_USERS", scope: "GLOBAL" },
  viewPrivateUsersGlobal: {
    id: 6,
    name: "VIEW_PRIVATE_USERS",
    scope: "GLOBAL",
  },
  createPublicProjectsGlobal: {
    id: 7,
    name: "CREATE_PUBLIC_PROJECTS",
    scope: "GLOBAL",
  },
  inviteToOwnedProjectsGlobal: {
    id: 8,
    name: "INVITE_TO_OWNED_PROJECTS",
    scope: "GLOBAL",
  },
  inviteProjectsGlobal: { id: 9, name: "INVITE_PROJECTS", scope: "GLOBAL" },
  updateProjectsGlobal: { id: 10, name: "UPDATE_PROJECTS", scope: "GLOBAL" },
  deleteProjectsGlobal: { id: 11, name: "DELETE_PROJECTS", scope: "GLOBAL" },
  viewPrivateProjectsGlobal: {
    id: 12,
    name: "VIEW_PRIVATE_PROJECTS",
    scope: "GLOBAL",
  },
  viewPrivateBlogsGlobal: {
    id: 13,
    name: "VIEW_PRIVATE_BLOGS",
    scope: "GLOBAL",
  },
  createBlogsGlobal: { id: 14, name: "CREATE_BLOGS", scope: "GLOBAL" },
  updateBlogsGlobal: { id: 15, name: "UPDATE_BLOGS", scope: "GLOBAL" },
  deleteBlogsGlobal: { id: 16, name: "DELETE_BLOGS", scope: "GLOBAL" },
} satisfies Record<string, Permission>;

export const DEVELOPMENT_GLOBAL_ROLES = [
  {
    id: 1,
    name: "admin",
    permissions: [
      PERMISSIONS.createUsersGlobal,
      PERMISSIONS.updateUsersGlobal,
      PERMISSIONS.deleteUsersGlobal,
      PERMISSIONS.updateOwnUserGlobal,
      PERMISSIONS.banUsersGlobal,
      PERMISSIONS.viewPrivateUsersGlobal,
      PERMISSIONS.createPublicProjectsGlobal,
      PERMISSIONS.inviteToOwnedProjectsGlobal,
      PERMISSIONS.inviteProjectsGlobal,
      PERMISSIONS.updateProjectsGlobal,
      PERMISSIONS.deleteProjectsGlobal,
      PERMISSIONS.viewPrivateProjectsGlobal,
      PERMISSIONS.viewPrivateBlogsGlobal,
      PERMISSIONS.createBlogsGlobal,
      PERMISSIONS.updateBlogsGlobal,
      PERMISSIONS.deleteBlogsGlobal,
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
      PERMISSIONS.updateOwnUserGlobal,
      PERMISSIONS.createPublicProjectsGlobal,
      PERMISSIONS.inviteToOwnedProjectsGlobal,
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
