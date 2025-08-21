export const GET_USER_CREDENTIALS =
  "SELECT id, username, password from users WHERE username = $1 AND deleted = false AND banned = false LIMIT 1";

export const GET_USER_PERMISSIONS = `select p.id, p.name, p.scope from users u
join global_role_permissions grp on u.rol_id = grp.global_role_id 
join permissions p on grp.permission_id = p.id
where u.id = $1`;

export const GET_USERS = `select id, rol_id, username, '****' as "password", coalesce(profile_photo, '') as "profile_photo", coalesce(phone, '') as "phone", coalesce(email, '') as "email", public, banned, deleted, created_at, updated_at FROM users _1 ORDER BY created_at DESC OFFSET $1 LIMIT $2;`;

export const COUNT_USERS = `SELECT COUNT(*) AS total FROM users _1`;

export const GET_USER_STATUS = `SELECT banned FROM users WHERE id = $1 AND deleted = false LIMIT 1`;

export const CREATE_USER = `INSERT INTO users (rol_id, username, "password", profile_photo, phone, email, public, banned, deleted, created_at, updated_at)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, rol_id, username, '****' as "password", coalesce(profile_photo, '') as "profile_photo", coalesce(phone, '') as "phone", coalesce(email, '') as "email", public, banned, deleted, created_at, updated_at`;

export const SOFT_DELETE_USER = `UPDATE users SET deleted = true WHERE id = $1 AND deleted = false`;

export const RECOVER_USER = `UPDATE users SET deleted = false WHERE id = $1`;

export const BAN_USER = `UPDATE users SET banned = true WHERE id = $1 AND deleted = false`;

export const UNBAN_USER = `UPDATE users SET banned = false WHERE id = $1 AND deleted = false`;

export const UPDATE_USER_ROLE = `UPDATE users SET rol_id = $1 WHERE id = $2 AND deleted = false`;

export const PATCH_USER = `UPDATE users SET username = COALESCE($1, username), profile_photo = COALESCE($2, profile_photo), phone = COALESCE($3, phone),
email = COALESCE($4, email), public = COALESCE($5, public) WHERE id = $6 RETURNING id, rol_id, username, '****' as "password",
coalesce(profile_photo, '') as "profile_photo", coalesce(phone, '') as "phone", coalesce(email, '') as "email", public, banned, deleted, 
created_at, updated_at`;

export const CREATE_EXPERIENCE = `INSERT INTO experiences (user_id, company_name, "role", description, "location", start_date, end_date, 
company_logo, created_at, updated_at) select u.id, $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP from users u
where u.id = $8 and u.deleted = false RETURNING id, user_id, company_name, role, description, location, start_date, end_date, coalesce(company_logo, '') as "company_logo", created_at, updated_at`;

export const PATCH_EXPERIENCE = `UPDATE experiences SET company_name=COALESCE($1, company_name), "role"=COALESCE($2, role), description=COALESCE($3, description), 
"location"=COALESCE($4, location), start_date=COALESCE($5, start_date), end_date=COALESCE($6, end_date), company_logo=COALESCE($7, company_logo) WHERE id=$8
RETURNING id, user_id, company_name, role, description, location, start_date, end_date, coalesce(company_logo, '') as "company_logo", created_at, updated_at`;

export const DELETE_EXPERIENCE = `DELETE FROM experiences WHERE id = $1`;

export const GET_EXPERIENCE_USER_ID =
  "SELECT user_id FROM experiences WHERE id = $1 LIMIT 1";

export const CREATE_EDUCATION = `INSERT INTO education (user_id, start_date, end_date, institution, field, "location", description, created_at, updated_at) 
select u.id, $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP from users u where u.id = $7 and u.deleted = false returning id, start_date, 
end_date, institution, field, location, coalesce(description, '') as description, created_at, updated_at`;

export const DELETE_EDUCATION = "DELETE FROM education WHERE id = $1";

export const GET_EDUCATION_USER_ID =
  "SELECT user_id FROM education WHERE id = $1 LIMIT 1";

export const PATCH_EDUCATION = `UPDATE education SET start_date=COALESCE($1, start_date), end_date=COALESCE($2, end_date), institution=COALESCE($3, institution),
field=COALESCE($4, field), "location"=COALESCE($5, location), description=COALESCE($6, description) WHERE id=$7
returning id, start_date, end_date, institution, field, location, coalesce(description, '') as description, created_at, updated_at`;

export const ADD_USER_SKILL = `INSERT INTO users_skills (user_id, skill_id, created_at, updated_at) SELECT u.id, s.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u JOIN skills s ON s.id = $2 WHERE u.id = $1 AND u.deleted = false;`;

export const REMOVE_USER_SKILL = `DELETE FROM users_skills WHERE user_id=$1 AND skill_id=$2;`;

export const GET_SKILLS = `SELECT * FROM skills ORDER BY created_at DESC OFFSET $1 LIMIT $2;`;

export const COUNT_SKILLS = `SELECT COUNT(*) AS total FROM skills`;

export const ADD_USER_TECHNOLOGY = `INSERT INTO users_technologies (user_id, technology_id, created_at, updated_at) SELECT u.id, t.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u JOIN technologies t ON t.id = $2 WHERE u.id = $1 AND u.deleted = false`;