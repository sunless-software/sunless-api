import { HTTP_STATUS_CODE_CONFLICT } from "../constants/httpStatusCodes";
import {
  DEFAULT_ERROR_API_RESPONSE,
  EXTERNAL_RESOURCES_URL_VIOLATION_MESSAGE,
  GLOBAL_ROLES_ROLENAME_VIOLATION_MESSAGE,
  PERMISSIONS_NAME_VIOLATION_MESSAGE,
  PROJECT_ROLES_ROLENAME_VIOLATION_MESSAGE,
  PROJECTS_KEY_VIOLATION_MESSAGE,
  PROJECTS_NAME_VIOLATION_MESSAGE,
  SKILLS_NAME_VIOLATION_MESSAGE,
  TAGS_NAME_VIOLATION_MESSAGE,
  TECHNOLOGIES_NAME_VIOLATION_MESSAGE,
  USERS_EMAIL_VIOLATION_MESSAGE,
  USERS_SKILLS_PK_VIOLATION_MESSAGE,
  USERS_USERNAME_VIOLATION_MESSAGE,
} from "../constants/messages";
import logger from "../logger";

export function handleDuplicatedKeyViolation(violation: string) {
  const response = {
    ...DEFAULT_ERROR_API_RESPONSE,
    status: HTTP_STATUS_CODE_CONFLICT,
  };

  const USERS_SKILLS_PK_VIOLATION = "users_skills_pkey";
  const USERS_USERNAME_VIOLATION = "users_username_key";
  const USERS_EMAIL_VIOLATION = "users_email_key";
  const TAGS_NAME_VIOLATION = "tags_name_key";
  const PROJECTS_NAME_VIOLATION = "projects_name_key";
  const PROJECTS_KEY_VIOLATION = "projects_key_key";
  const GLOBAL_ROLES_ROLENAME_VIOLATION = "global_roles_role_name_key";
  const SKILLS_NAME_VIOLATION = "skills_name_key";
  const PERMISSIONS_NAME_VIOLATION = "permissions_name_key";
  const PROJECT_ROLES_ROLENAME_VIOLATION = "project_roles_role_name_key";
  const TECHNOLOGIES_NAME_VIOLATION = "technologies_name_key";
  const EXTERNAL_RESOURCES_URL_VIOLATION = "external_resources_url_key";

  switch (violation) {
    case USERS_USERNAME_VIOLATION:
      return {
        ...response,
        message: USERS_USERNAME_VIOLATION_MESSAGE,
      };
    case USERS_EMAIL_VIOLATION:
      return {
        ...response,
        message: USERS_EMAIL_VIOLATION_MESSAGE,
      };
    case TAGS_NAME_VIOLATION:
      return {
        ...response,
        message: TAGS_NAME_VIOLATION_MESSAGE,
      };
    case PROJECTS_NAME_VIOLATION:
      return {
        ...response,
        message: PROJECTS_NAME_VIOLATION_MESSAGE,
      };
    case PROJECTS_KEY_VIOLATION:
      return {
        ...response,
        message: PROJECTS_KEY_VIOLATION_MESSAGE,
      };
    case GLOBAL_ROLES_ROLENAME_VIOLATION:
      return {
        ...response,
        message: GLOBAL_ROLES_ROLENAME_VIOLATION_MESSAGE,
      };
    case SKILLS_NAME_VIOLATION:
      return {
        ...response,
        message: SKILLS_NAME_VIOLATION_MESSAGE,
      };
    case PERMISSIONS_NAME_VIOLATION:
      return {
        ...response,
        message: PERMISSIONS_NAME_VIOLATION_MESSAGE,
      };
    case PROJECT_ROLES_ROLENAME_VIOLATION:
      return {
        ...response,
        message: PROJECT_ROLES_ROLENAME_VIOLATION_MESSAGE,
      };
    case TECHNOLOGIES_NAME_VIOLATION:
      return {
        ...response,
        message: TECHNOLOGIES_NAME_VIOLATION_MESSAGE,
      };
    case EXTERNAL_RESOURCES_URL_VIOLATION:
      return {
        ...response,
        message: EXTERNAL_RESOURCES_URL_VIOLATION_MESSAGE,
      };
    case USERS_SKILLS_PK_VIOLATION:
      return {
        ...response,
        message: USERS_SKILLS_PK_VIOLATION_MESSAGE,
      };
    default:
      logger.error(
        `An unhandled not unique contraint violation was thrown "${violation}"`
      );
      return DEFAULT_ERROR_API_RESPONSE;
  }
}
