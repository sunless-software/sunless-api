export const NODE_ENV_DEVELOPMENT = "development";

export const HTTP_STATUS_CODE_OK = 200;
export const HTTP_STATUS_CODE_UNAUTHORIZED = 401;
export const HTTP_STATUS_CODE_FORBIDDEN = 403;
export const HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR = 500;
export const HTTP_STATUS_CODE_BAD_REQUEST = 400;

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

export const PERMISSIONS = [
  { name: "CREATE_USERS", scope: "GLOBAL" },
  { name: "UPDATE_USERS", scope: "GLOBAL" },
  { name: "DELETE_USERS", scope: "GLOBAL" },
  { name: "UPDATE_OWN_USER", scope: "GLOBAL" },
  { name: "BAN_USERS", scope: "GLOBAL" },
  { name: "VIEW_PRIVATE_USERS", scope: "GLOBAL" },

  { name: "CREATE_PUBLIC_PROJECTS", scope: "GLOBAL" },
  { name: "INVITE_TO_OWNED_PROJECTS", scope: "GLOBAL" },
  { name: "INVITE_PROJECTS", scope: "GLOBAL" },
  { name: "UPDATE_PROJECTS", scope: "GLOBAL" },
  { name: "DELETE_PROJECTS", scope: "GLOBAL" },
  { name: "VIEW_PRIVATE_PROJECTS", scope: "GLOBAL" },
  { name: "VIEW_PRIVATE_BLOGS", scope: "GLOBAL" },

  { name: "CREATE_BLOGS", scope: "GLOBAL" },
  { name: "UPDATE_BLOGS", scope: "GLOBAL" },
  { name: "DELETE_BLOGS", scope: "GLOBAL" },
];

export const DEVELOPMENT_GLOBAL_ROLES = [
  {
    id: 1,
    name: "admin",
    permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  },
  {
    id: 2,
    name: "client",
    permissions: [],
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
];
