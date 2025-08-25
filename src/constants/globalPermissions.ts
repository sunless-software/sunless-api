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
  viewDeletedUsers: {
    id: 9,
    name: "VIEW_DELETED_USERS",
    scope: "GLOBAL",
  },
  createPublicProjects: {
    id: 10,
    name: "CREATE_PUBLIC_PROJECTS",
    scope: "GLOBAL",
  },
  inviteToOwnedProjects: {
    id: 11,
    name: "INVITE_TO_OWNED_PROJECTS",
    scope: "GLOBAL",
  },
  inviteProjects: { id: 12, name: "INVITE_PROJECTS", scope: "GLOBAL" },
  updateProjects: { id: 13, name: "UPDATE_PROJECTS", scope: "GLOBAL" },
  deleteProjects: { id: 14, name: "DELETE_PROJECTS", scope: "GLOBAL" },
  viewPrivateProjects: {
    id: 15,
    name: "VIEW_PRIVATE_PROJECTS",
    scope: "GLOBAL",
  },
  viewPrivateBlogs: {
    id: 16,
    name: "VIEW_PRIVATE_BLOGS",
    scope: "GLOBAL",
  },
  createBlogs: { id: 17, name: "CREATE_BLOGS", scope: "GLOBAL" },
  updateBlogs: { id: 18, name: "UPDATE_BLOGS", scope: "GLOBAL" },
  deleteBlogs: { id: 19, name: "DELETE_BLOGS", scope: "GLOBAL" },
  manageUserRoles: { id: 20, name: "MANAGE_USER_ROLES", scope: "GLOBAL" },
  createOwnExperiences: {
    id: 21,
    name: "CREATE_OWN_EXPERIENCES",
    scope: "GLOBAL",
  },
  createExperiences: { id: 22, name: "CREATE_EXPERIENCES", scope: "GLOBAL" },
  deleteOwnExperiences: {
    id: 23,
    name: "DELETE_OWN_EXPERIENCES",
    scope: "GLOBAL",
  },
  deleteExperiences: {
    id: 24,
    name: "DELETE_EXPERIENCES",
    scope: "GLOBAL",
  },
  updateOwnExperiences: {
    id: 25,
    name: "UPDATE_OWN_EXPERIENCES",
    scope: "GLOBAL",
  },
  updateExperiences: {
    id: 26,
    name: "UPDATE_EXPERIENCES",
    scope: "GLOBAL",
  },
  createOwnEducations: {
    id: 27,
    name: "CREATE_OWN_EDUCATIONS",
    scope: "GLOBAL",
  },
  createEducations: {
    id: 28,
    name: "CREATE_EDUCATIONS",
    scope: "GLOBAL",
  },
  deleteOwnEducation: {
    id: 29,
    name: "DELETE_OWN_EDUCATIONS",
    scope: "GLOBAL",
  },
  deleteEducations: {
    id: 30,
    name: "DELETE_EDUCATIONS",
    scope: "GLOBAL",
  },
  updateOwnEducations: {
    id: 31,
    name: "UPDATE_OWN_EDUCATIONS",
    scope: "GLOBAL",
  },
  updateEducations: {
    id: 32,
    name: "UPDATE_EDUCATIONS",
    scope: "GLOBAL",
  },
  addOwnSkills: {
    id: 33,
    name: "ADD_OWN_SKILLS",
    scope: "GLOBAL",
  },
  addSkills: {
    id: 34,
    name: "ADD_SKILLS",
    scope: "GLOBAL",
  },
  removeOwnSkills: {
    id: 35,
    name: "REMOVE_OWN_SKILLS",
    scope: "GLOBAL",
  },
  removeSkills: {
    id: 36,
    name: "REMOVE_SKILLS",
    scope: "GLOBAL",
  },
  addOwnTechnologies: {
    id: 37,
    name: "ADD_OWN_TECHNOLOGIES",
    scope: "GLOBAL",
  },
  addTechnologies: {
    id: 38,
    name: "ADD_TECHNOLOGIES",
    scope: "GLOBAL",
  },
  removeOwnTechnologies: {
    id: 39,
    name: "REMOVE_OWN_TECHNOLOGIES",
    scope: "GLOBAL",
  },
  removeTechnologies: {
    id: 40,
    name: "REMOVE_TECHNOLOGIES",
    scope: "GLOBAL",
  },
  getPrivateUserDetails: {
    id: 41,
    name: "GET_PRIVATE_USER_DETAILS",
    scope: "GLOBAL",
  },
  getDeletedUserDetails: {
    id: 42,
    name: "GET_DELETED_USER_DETAILS",
    scope: "GLOBAL",
  },
  createPrivateProjects: {
    id: 43,
    name: "CREATE_PRIVATE_PROJECTS",
    scope: "GLOBAL",
  },
} satisfies Record<string, Permission>;
