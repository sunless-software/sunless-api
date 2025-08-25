import { Permission } from "../interfaces";

export const GLOBAL_PERMISSIONS = {
  createUsers: { id: 1, name: "CREATE_USERS" },
  updateUsers: { id: 2, name: "UPDATE_USERS" },
  deleteUsers: { id: 3, name: "DELETE_USERS" },
  recoverUsers: { id: 4, name: "RECOVER_USERS" },
  updateOwnUser: { id: 5, name: "UPDATE_OWN_USER" },
  banUsers: { id: 6, name: "BAN_USERS" },
  unbanUsers: { id: 7, name: "UNBAN_USERS" },
  viewPrivateUsers: {
    id: 8,
    name: "VIEW_PRIVATE_USERS",
  },
  viewDeletedUsers: {
    id: 9,
    name: "VIEW_DELETED_USERS",
  },
  createPublicProjects: {
    id: 10,
    name: "CREATE_PUBLIC_PROJECTS",
  },
  inviteToOwnedProjects: {
    id: 11,
    name: "INVITE_TO_OWNED_PROJECTS",
  },
  inviteProjects: { id: 12, name: "INVITE_PROJECTS" },
  updateProjects: { id: 13, name: "UPDATE_PROJECTS" },
  deleteProjects: { id: 14, name: "DELETE_PROJECTS" },
  viewPrivateProjects: {
    id: 15,
    name: "VIEW_PRIVATE_PROJECTS",
  },
  viewPrivateBlogs: {
    id: 16,
    name: "VIEW_PRIVATE_BLOGS",
  },
  createBlogs: { id: 17, name: "CREATE_BLOGS" },
  updateBlogs: { id: 18, name: "UPDATE_BLOGS" },
  deleteBlogs: { id: 19, name: "DELETE_BLOGS" },
  manageUserRoles: { id: 20, name: "MANAGE_USER_ROLES" },
  createOwnExperiences: {
    id: 21,
    name: "CREATE_OWN_EXPERIENCES",
  },
  createExperiences: { id: 22, name: "CREATE_EXPERIENCES" },
  deleteOwnExperiences: {
    id: 23,
    name: "DELETE_OWN_EXPERIENCES",
  },
  deleteExperiences: {
    id: 24,
    name: "DELETE_EXPERIENCES",
  },
  updateOwnExperiences: {
    id: 25,
    name: "UPDATE_OWN_EXPERIENCES",
  },
  updateExperiences: {
    id: 26,
    name: "UPDATE_EXPERIENCES",
  },
  createOwnEducations: {
    id: 27,
    name: "CREATE_OWN_EDUCATIONS",
  },
  createEducations: {
    id: 28,
    name: "CREATE_EDUCATIONS",
  },
  deleteOwnEducation: {
    id: 29,
    name: "DELETE_OWN_EDUCATIONS",
  },
  deleteEducations: {
    id: 30,
    name: "DELETE_EDUCATIONS",
  },
  updateOwnEducations: {
    id: 31,
    name: "UPDATE_OWN_EDUCATIONS",
  },
  updateEducations: {
    id: 32,
    name: "UPDATE_EDUCATIONS",
  },
  addOwnSkills: {
    id: 33,
    name: "ADD_OWN_SKILLS",
  },
  addSkills: {
    id: 34,
    name: "ADD_SKILLS",
  },
  removeOwnSkills: {
    id: 35,
    name: "REMOVE_OWN_SKILLS",
  },
  removeSkills: {
    id: 36,
    name: "REMOVE_SKILLS",
  },
  addOwnTechnologies: {
    id: 37,
    name: "ADD_OWN_TECHNOLOGIES",
  },
  addTechnologies: {
    id: 38,
    name: "ADD_TECHNOLOGIES",
  },
  removeOwnTechnologies: {
    id: 39,
    name: "REMOVE_OWN_TECHNOLOGIES",
  },
  removeTechnologies: {
    id: 40,
    name: "REMOVE_TECHNOLOGIES",
  },
  getPrivateUserDetails: {
    id: 41,
    name: "GET_PRIVATE_USER_DETAILS",
  },
  getDeletedUserDetails: {
    id: 42,
    name: "GET_DELETED_USER_DETAILS",
  },
  createPrivateProjects: {
    id: 43,
    name: "CREATE_PRIVATE_PROJECTS",
  },
} satisfies Record<string, Permission>;
