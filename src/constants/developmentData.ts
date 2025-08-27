import { GLOBAL_PERMISSIONS } from "./globalPermissions";
import { PROJECT_PERMISSIONS } from "./projectPermissions";

export const DEVELOPMENT_GLOBAL_ROLES = [
  {
    id: 1,
    role_name: "admin",
    permissions: [
      GLOBAL_PERMISSIONS.createUsers,
      GLOBAL_PERMISSIONS.updateUsers,
      GLOBAL_PERMISSIONS.deleteUsers,
      GLOBAL_PERMISSIONS.recoverUsers,
      GLOBAL_PERMISSIONS.updateOwnUser,
      GLOBAL_PERMISSIONS.banUsers,
      GLOBAL_PERMISSIONS.unbanUsers,
      GLOBAL_PERMISSIONS.viewPrivateUsers,
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
      GLOBAL_PERMISSIONS.manageUserRoles,
      GLOBAL_PERMISSIONS.createOwnExperiences,
      GLOBAL_PERMISSIONS.createExperiences,
      GLOBAL_PERMISSIONS.deleteOwnExperiences,
      GLOBAL_PERMISSIONS.deleteExperiences,
      GLOBAL_PERMISSIONS.updateOwnExperiences,
      GLOBAL_PERMISSIONS.updateExperiences,
      GLOBAL_PERMISSIONS.createOwnEducations,
      GLOBAL_PERMISSIONS.createEducations,
      GLOBAL_PERMISSIONS.deleteOwnEducation,
      GLOBAL_PERMISSIONS.deleteEducations,
      GLOBAL_PERMISSIONS.updateOwnEducations,
      GLOBAL_PERMISSIONS.updateEducations,
      GLOBAL_PERMISSIONS.addOwnSkills,
      GLOBAL_PERMISSIONS.addSkills,
      GLOBAL_PERMISSIONS.removeOwnSkills,
      GLOBAL_PERMISSIONS.removeSkills,
      GLOBAL_PERMISSIONS.addTechnologies,
      GLOBAL_PERMISSIONS.addOwnTechnologies,
      GLOBAL_PERMISSIONS.removeOwnTechnologies,
      GLOBAL_PERMISSIONS.removeTechnologies,
      GLOBAL_PERMISSIONS.getPrivateUserDetails,
      GLOBAL_PERMISSIONS.getDeletedUserDetails,
      GLOBAL_PERMISSIONS.createPrivateProjects,
    ],
  },
  {
    id: 2,
    role_name: "client",
    permissions: [],
  },
  {
    id: 3,
    role_name: "user",
    permissions: [
      GLOBAL_PERMISSIONS.updateOwnUser,
      GLOBAL_PERMISSIONS.createPublicProjects,
      GLOBAL_PERMISSIONS.inviteToOwnedProjects,
      GLOBAL_PERMISSIONS.createOwnExperiences,
      GLOBAL_PERMISSIONS.deleteOwnExperiences,
      GLOBAL_PERMISSIONS.updateOwnExperiences,
      GLOBAL_PERMISSIONS.createOwnEducations,
      GLOBAL_PERMISSIONS.deleteOwnEducation,
      GLOBAL_PERMISSIONS.updateOwnEducations,
      GLOBAL_PERMISSIONS.addOwnSkills,
      GLOBAL_PERMISSIONS.removeOwnSkills,
      GLOBAL_PERMISSIONS.addOwnTechnologies,
      GLOBAL_PERMISSIONS.removeOwnTechnologies,
    ],
  },
];

export const DEVELOPMENT_PROJECT_ROLES = [
  {
    id: 1,
    role_name: "admin",
    permissions: [
      PROJECT_PERMISSIONS.updateProjects,
      PROJECT_PERMISSIONS.deleteProject,
      PROJECT_PERMISSIONS.setPrivateProject,
      PROJECT_PERMISSIONS.setPublicProject,
      PROJECT_PERMISSIONS.addTechnologiesProject,
      PROJECT_PERMISSIONS.removeTechnologiesProject,
      PROJECT_PERMISSIONS.inviteProject,
    ],
  },
];

export const DEVELOPMENT_USERS = [
  {
    username: "sunless_admin",
    password: "Password123!",
    rol_id: 1,
    public: true,
    banned: false,
    deleted: false,
  },
  {
    username: "sunless_client",
    password: "Password123!",
    rol_id: 2,
    public: true,
    banned: false,
    deleted: false,
  },
  {
    username: "sunless_user",
    password: "Password123!",
    rol_id: 3,
    public: true,
    banned: false,
    deleted: false,
  },
];

export const DEVELOPMENT_USERS_EXPERIENCES = [
  {
    user_id: 3,
    company_name: "Random Software company",
    role: "SSR developer",
    description: "I developed software for random software commpany",
    location: "Semi remote",
    start_date: (() => {
      const now = new Date();
      now.setFullYear(now.getFullYear() - 2);
      return now.toISOString();
    })(),
    end_date: (() => {
      const now = new Date();
      now.setDate(now.getDate() - 14);
      return now.toISOString();
    })(),
    company_logo: "https://random-software-company-logo.png",
  },
  {
    user_id: 3,
    company_name: "Sunless Software",
    role: "SR developer",
    description: "I developed software for sunless software",
    location: "Remote",
    start_date: (() => {
      const now = new Date();
      return now.toISOString();
    })(),
    end_date: null,
    company_logo: null,
  },
];

export const DEVELOPMENT_USERS_EDUCATIONS = [
  {
    user_id: 3,
    start_date: (() => {
      const now = new Date();
      now.setFullYear(now.getFullYear() - 5);
      return now.toISOString();
    })(),
    end_date: (() => {
      const now = new Date();
      now.setFullYear(now.getFullYear() - 3);
      return now.toISOString();
    })(),
    institution: "University of software",
    field: "Software development",
    location: "Buenos Aires, Argentina",
    description:
      "I studied software development in the university of Buenos Aires",
  },
  {
    user_id: 3,
    start_date: (() => {
      const now = new Date();
      now.setFullYear(now.getFullYear() - 2);
      return now.toISOString();
    })(),
    end_date: null,
    institution: "Remote software academy",
    field: "Cibersecurity",
    location: "Remote",
    description: null,
  },
];

export const DEVELOPMENT_USERS_TECHNOLOGIES = [
  {
    user_id: 3,
    technology_id: 1,
  },
  {
    user_id: 3,
    technology_id: 2,
  },
  {
    user_id: 3,
    technology_id: 3,
  },
  {
    user_id: 3,
    technology_id: 4,
  },
];

export const DEVELOPMENT_USERS_SKILLS = [
  {
    user_id: 3,
    skill_id: 1,
  },
  {
    user_id: 3,
    skill_id: 2,
  },
  {
    user_id: 3,
    skill_id: 3,
  },
];
