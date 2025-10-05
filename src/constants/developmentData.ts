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
      GLOBAL_PERMISSIONS.readProjects,
      GLOBAL_PERMISSIONS.readBlogs,
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
      GLOBAL_PERMISSIONS.addProjectTags,
      GLOBAL_PERMISSIONS.removeProjectTags,
      GLOBAL_PERMISSIONS.addProjectExternalResources,
      GLOBAL_PERMISSIONS.deleteProjectExternalResources,
      GLOBAL_PERMISSIONS.updateProjectExternalResources,
      GLOBAL_PERMISSIONS.createProjectMedia,
      GLOBAL_PERMISSIONS.deleteProjectsMedia,
      GLOBAL_PERMISSIONS.updateProjectsMedia,
      GLOBAL_PERMISSIONS.getProjectDetails,
      GLOBAL_PERMISSIONS.unbanOwnUser,
      GLOBAL_PERMISSIONS.updateOwnProfile,
      GLOBAL_PERMISSIONS.updateProfiles,
      GLOBAL_PERMISSIONS.createTechnologies,
      GLOBAL_PERMISSIONS.createTags,
      GLOBAL_PERMISSIONS.createSkills,
      GLOBAL_PERMISSIONS.updateTags,
      GLOBAL_PERMISSIONS.updateTechnologies,
      GLOBAL_PERMISSIONS.updateSkills,
      GLOBAL_PERMISSIONS.createGlobalRoles,
      GLOBAL_PERMISSIONS.updateGlobalRoles,
      GLOBAL_PERMISSIONS.listPermissions,
      GLOBAL_PERMISSIONS.createProjectRoles,
      GLOBAL_PERMISSIONS.updateProjectRoles,
      GLOBAL_PERMISSIONS.updateUsersPassword,
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
      GLOBAL_PERMISSIONS.readProjects,
      GLOBAL_PERMISSIONS.readBlogs,
      GLOBAL_PERMISSIONS.updateOwnProfile,
    ],
  },
];

export const DEVELOPMENT_PROJECT_ROLES = [
  {
    id: 1,
    role_name: "owner",
    permissions: [
      PROJECT_PERMISSIONS.updateProjects,
      PROJECT_PERMISSIONS.deleteProject,
      PROJECT_PERMISSIONS.setPrivateProject,
      PROJECT_PERMISSIONS.setPublicProject,
      PROJECT_PERMISSIONS.addTechnologies,
      PROJECT_PERMISSIONS.removeTechnologies,
      PROJECT_PERMISSIONS.inviteProject,
      PROJECT_PERMISSIONS.createBlogs,
      PROJECT_PERMISSIONS.deleteBlogs,
      PROJECT_PERMISSIONS.updateBlogs,
      PROJECT_PERMISSIONS.addProjectTags,
      PROJECT_PERMISSIONS.removeProjectTags,
      PROJECT_PERMISSIONS.addProjectExternalResources,
      PROJECT_PERMISSIONS.deleteProjectExternalResources,
      PROJECT_PERMISSIONS.updateProjectExternalResources,
      PROJECT_PERMISSIONS.createProjectMedia,
      PROJECT_PERMISSIONS.deleteProjectMedia,
      PROJECT_PERMISSIONS.updateProjectMedia,
      PROJECT_PERMISSIONS.getProjectDetails,
    ],
  },
  {
    id: 2,
    role_name: "admin",
    permissions: [
      PROJECT_PERMISSIONS.updateProjects,
      PROJECT_PERMISSIONS.deleteProject,
      PROJECT_PERMISSIONS.setPrivateProject,
      PROJECT_PERMISSIONS.setPublicProject,
      PROJECT_PERMISSIONS.addTechnologies,
      PROJECT_PERMISSIONS.removeTechnologies,
      PROJECT_PERMISSIONS.inviteProject,
      PROJECT_PERMISSIONS.createBlogs,
      PROJECT_PERMISSIONS.deleteBlogs,
      PROJECT_PERMISSIONS.updateBlogs,
      PROJECT_PERMISSIONS.addProjectTags,
      PROJECT_PERMISSIONS.removeProjectTags,
      PROJECT_PERMISSIONS.addProjectExternalResources,
      PROJECT_PERMISSIONS.deleteProjectExternalResources,
      PROJECT_PERMISSIONS.updateProjectExternalResources,
      PROJECT_PERMISSIONS.createProjectMedia,
      PROJECT_PERMISSIONS.deleteProjectMedia,
      PROJECT_PERMISSIONS.updateProjectMedia,
      PROJECT_PERMISSIONS.getProjectDetails,
    ],
  },
];

export const DEVELOPMENT_USERS = [
  {
    username: "sunless_admin",
    password: "Password123!",
    job_title: "Fullstack software developer",
    rol_id: 1,
    public: true,
    banned: false,
    deleted: false,
  },
  {
    username: "sunless_client",
    password: "Password123!",
    job_title: "Client",
    rol_id: 2,
    public: true,
    banned: false,
    deleted: false,
  },
  {
    username: "sunless_user",
    password: "Password123!",
    job_title: "SSR Sofware developer",
    rol_id: 3,
    public: true,
    banned: false,
    deleted: false,
  },
];

export const DEVELOPMENT_USER_PROFILES = [
  {
    user_id: 1,
  },
  {
    user_id: 2,
  },
  {
    user_id: 3,
  },
];

export const DEVELOPMENT_USERS_EXPERIENCES = [
  {
    user_id: 3,
    company_name: "Random Software company",
    role_us: "SSR developer",
    description_us: "I developed software for random software commpany",
    location_us: "Semi remote",
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
    role_us: "SR developer",
    description_us: "I developed software for sunless software",
    location_us: "Remote",
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
    field_us: "Software development",
    location_us: "Buenos Aires, Argentina",
    description_us:
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
    field_us: "Cibersecurity",
    location_us: "Remote",
    description_us: null,
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

export const DEVELOPMENT_SKILLS = [
  { name: "Problem solving" },
  { name: "Logical thinking" },
  { name: "Attention to detail" },
  { name: "Communication" },
  { name: "Teamwork" },
  { name: "Adaptability" },
  { name: "Time management" },
  { name: "Critical thinking" },
  { name: "Debugging" },
  { name: "Code readability" },
  { name: "Algorithmic thinking" },
  { name: "Version control discipline" },
  { name: "Writing technical documentation" },
  { name: "Testing mindset" },
  { name: "Continuous learning" },
];

export const DEVELOPMENT_TECHNOLOGIES = [
  { name: "React" },
  { name: "Vue.js" },
  { name: "Angular" },
  { name: "Node.js" },
  { name: "Express" },
  { name: "Django" },
  { name: "Flask" },
  { name: "Ruby on Rails" },
  { name: "Spring Boot" },
  { name: "Laravel" },
  { name: "GraphQL" },
  { name: "TypeScript" },
  { name: "JavaScript" },
  { name: "Python" },
  { name: "Java" },
  { name: "C#" },
  { name: "Docker" },
  { name: "Kubernetes" },
  { name: "Redis" },
  { name: "PostgreSQL" },
  { name: "MongoDB" },
  { name: "AWS" },
  { name: "Azure" },
  { name: "GCP" },
  { name: "Webpack" },
  { name: "Babel" },
  { name: "Tailwind CSS" },
  { name: "Sass" },
  { name: "Next.js" },
];

export const DEVELOPMENT_TAGS = [
  { name: "2D" },
  { name: "3D" },
  { name: "Game" },
  { name: "Mobile" },
  { name: "Web" },
  { name: "VR" },
  { name: "Application" },
  { name: "Cloud" },
  { name: "Desktop" },
  { name: "API" },
  { name: "Client interface" },
  { name: "Backend" },
  { name: "Frontend" },
  { name: "Monolith" },
  { name: "Microservices" },
];
