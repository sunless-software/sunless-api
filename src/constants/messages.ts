import { ApiResponse } from "../interfaces";

export const DEFAULT_HEALTH_ENDPOINT_MESSAGE =
  "May the moon shine upon you, Sunless one.";
export const UNEXPECTED_ERROR_DEFAULT_MESSAGE =
  "An unexpected error has occurred, if you have acces to the server check logs for more info or contact an admin.";
export const INSUFICIENT_PERMISSIONS_MESSAGE = "You shall not pass!";
export const INVALID_USER_STATUS_MESSAGE = "You are no longer welcome here.";
export const USER_SUCCESSFUL_CREATION_MESSAGE = "User successfully created.";
export const DUPLICATED_PRIMARY_KEY_MESSAGE =
  "A user with the same primary key already exists.";
export const USERS_SUCCESSFULLY_RETRIEVED_MESSAGE =
  "Users successfully retrieved.";
export const USER_SUCCESSFULLY_DELETED_MESSAGE =
  "The user has been successfully deleted.";
export const EXPERIENCE_SUCCESSFULLY_DELETED_MESSAGE =
  "The experience has been successfully deleted.";
export const USER_SUCCESSFULLY_RECOVERED_MESSAGE =
  "The user has been successfully recovered.";
export const USER_SUCCESSFULLY_BANNED_MESSAGE =
  "The user has been successfully banned.";
export const USER_SUCCESSFULLY_UNBANNED_MESSAGE =
  "The user has been successfully unbanned.";
export const USER_NOT_FOUND_MESSAGE =
  "The user with the given id does not exists.";
export const EXPERIENCE_NOT_FOUND_MESSAGE =
  "The experience with the given id does not exists.";
export const INVALID_USER_MESSAGE = "Your current user is invalid.";
export const USER_ROLE_SUCCESSFULY_UPDATED = "Role updated successfully.";
export const USER_SUCESSFULLY_UPDATED =
  "The user has been successfully updated.";
export const EXPERIENCE_SUCCESSFULLY_CREATED =
  "The experience has been successfully created.";
export const EXPERIENCE_SUCCESSFULY_UPDATED =
  "Experience updated successfully.";
export const EDUCATION_SUCCESSFULLY_CREATED = "Study successfully created.";
export const EDUCATION_SUCCESSFULLY_DELETED = "Study successfully deleted.";
export const EDUCATION_SUCCESSFULY_UPDATED = "Study updated successfully.";
export const USER_SKILL_SUCCESSFULLY_ADDED =
  "The skill was successfully added to the user.";
export const ENTITY_NOT_FOUND_MESSAGE =
  "The entity with the given id does not exists.";
export const FOREIGN_KEY_VIOLATION_MESSAGE =
  "The provided id does not correspond to a valid entity.";
export const MAX_CHAR_EXCEED_MESSAGE =
  "The provided field exceeds the limit of characters.";
export const USER_SKILL_SUCCESSFULLY_REMOVED =
  "The skill has been successfully removed from the user.";
export const USERS_SKILLS_PK_VIOLATION_MESSAGE =
  "The user already has the skill you are trying to add.";
export const USERS_TECHNOLOGIES_PK_VIOLATION_MESSAGE =
  "The user already has the technology you are trying to add.";
export const PROJECTS_TECHNOLOGIES_PK_VIOLATION_MESSAGE =
  "The project already has the technology you are trying to add.";
export const USERS_USERNAME_VIOLATION_MESSAGE = "'username' already in use.";
export const USERS_EMAIL_VIOLATION_MESSAGE = "'email' already in use.";
export const TAGS_NAME_VIOLATION_MESSAGE = "tag 'name' already in use.";
export const PROJECTS_NAME_VIOLATION_MESSAGE = "project 'name' already in use.";
export const PROJECTS_KEY_VIOLATION_MESSAGE = "project 'key' already in use.";
export const GLOBAL_ROLES_ROLENAME_VIOLATION_MESSAGE =
  "'role_name' already in use.";
export const SKILLS_NAME_VIOLATION_MESSAGE = "skill 'name' already in use.";
export const PERMISSIONS_NAME_VIOLATION_MESSAGE =
  "permission 'name' already in use.";
export const PROJECT_ROLES_ROLENAME_VIOLATION_MESSAGE =
  "project 'role_name' already in use";
export const TECHNOLOGIES_NAME_VIOLATION_MESSAGE =
  "technology 'name' already in use.";
export const EXTERNAL_RESOURCES_URL_VIOLATION_MESSAGE =
  "external resource 'url' already in use.";
export const SKILLS_SUCCESSFULLY_RETRIEVED_MESSAGE =
  "Skills successfully retrieved.";
export const USER_TECHNOLOGY_SUCCESSFULLY_ADDED =
  "The technology was successfully added to the user.";
export const USER_TECHNOLOGY_SUCCESSFULLY_REMOVED =
  "The technology has been successfully removed from the user.";
export const TECHNOLOGIES_SUCCESSFULLY_RETRIEVED_MESSAGE =
  "Technologies successfully retrieved.";
export const USER_DETAILS_SUCCESSFULLY_RETRIEVED_MESSAGE =
  "User details successfully retrieved.";
export const PROJECT_SUCCESSFULLY_CREATED_MESSAGE =
  "The project has been successfully created.";
export const PROJECTS_NAME_HASH_VIOLATION_MESSAGE =
  "Project 'name' already in use.";
export const PROJECT_SUCCESSFULLY_DELETED_MESSAGE =
  "The project has been successfully deleted.";
export const PROJECT_SUCCESSFULLY_UPDATED =
  "The project has been successfully updated.";
export const PROJECT_TECHNOLOGY_SUCCESSFULLY_ADDED =
  "The technology was successfully added to the project.";
export const PROJECT_TECHNOLOGY_SUCCESSFULLY_REMOVED =
  "The technology has been successfully removed from the project.";
export const INVITATION_SUCCESSFULLY_CREATED =
  "The invitation to the project has been successfully created.";
export const MALFORMED_JWT_MESSAGE = "The JWT is not malformed.";
export const INVALID_JWT_SIGNATURE_MESSAGE =
  "The signature of the JWT is invalid.";
export const EXPIRED_JWT_MESSAGE = "The JWT is expired.";
export const INCORRECT_USER_INVITATION_MESSAGE =
  "This invitation is not for you.";
export const COLLABORATORS_PK_VIOLATION_MESSAGE =
  "The user already is a collaborator of the project.";
export const COLLABORATOR_SUCCESSFULLY_ADDED =
  "The user has been successfully added as a collaborator of the project.";
export const INVALID_JWT_MESSAGE = "The JWT is not valid.";
export const BLOG_SUCCESSFULLY_CREATED_MESSAGE =
  "The blog has been successfully created.";
export const BLOG_SUCCESSFULLY_DELETED_MESSAGE =
  "The blog has been successfully deleted.";
export const BLOG_SUCCESSFULY_UPDATED = "Blog successfully updated.";
export const TAG_SUCCESSFULLY_ADDED =
  "The tag has been successfully added to the project.";
export const TAG_SUCCESSFULLY_REMOVED =
  "The tag has been successfully removed from the project.";
export const PROJECT_TAGS_PK_VIOLATION_MESSAGE =
  "The project already has the tag you are trying to add.";
export const PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_ADDED =
  "The external resource was successfully added to the project.";
export const PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_PATCHED =
  "The external resource was successfully updated.";
export const PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_DELETED =
  "The external resource was successfully deleted.";
export const EXTERNAL_RESOURCES_URL_HASH_VIOLATION_MESSAGE =
  "There already is another external resource with the same url.";
export const PROJECT_MEDIA_SUCCESSFULLY_CREATED =
  "The project media has been successfully created.";
export const PROJECT_MEDIA_SUCCESSFULLY_UPDATED =
  "The project media has been successfully updated.";
export const PROJECT_MEDIA_SUCCESSFULLY_DELETED =
  "The project media has been successfully deleted.";
export const PROJECT_MEDIA_URL_PROJECT_VIOLATION_MESSAGE =
  "The project already have a media with the same url.";
export const PROJECTS_SUCCESSFULLY_RETRIEVED =
  "Projects successfully retrieved.";
export const PROJECT_DETAILS_SUCCESSFULLY_RETRIEVED =
  "Project details successfully retrieved.";
export const BLOGS_SUCCESSFULLY_RETRIEVED = "Blogs successfully retrieved.";
export const USER_PROFILE_SUCCESSFULLY_UPDATED =
  "The user profile has been successfully updated.";
export const USER_PROFILES_REPO_URL_VIOLATION_MESSAGE =
  "There already is another user profile with the same repo url.";
export const USER_PROFILES_WEBSITE_URL_VIOLATION_MESSAGE =
  "There already is another user profile with the same website url.";
export const USER_PROFILES_LINKEDIN_URL_VIOLATION_MESSAGE =
  "There already is another user profile with the same linkedin url.";

export const DEFAULT_SUCCES_API_RESPONSE: ApiResponse<[]> = {
  status: 200,
  message: "Sucessful request",
  data: [],
  pagination: {
    offset: 0,
    limit: 0,
    count: 0,
    total: 0,
  },
};

export const DEFAULT_ERROR_API_RESPONSE: ApiResponse<[]> = {
  status: 500,
  message: UNEXPECTED_ERROR_DEFAULT_MESSAGE,
  data: [],
  pagination: {
    offset: 0,
    limit: 0,
    count: 0,
    total: 0,
  },
};
