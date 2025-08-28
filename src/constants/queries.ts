export const GET_USER_CREDENTIALS =
  "SELECT id, username, password from users WHERE username = $1 AND deleted = false AND banned = false LIMIT 1";

export const GET_USER_GLOBAL_PERMISSIONS = `select p.id, p.name, p.scope from users u
join global_role_permissions grp on u.rol_id = grp.global_role_id 
join permissions p on grp.permission_id = p.id
where u.id = $1 and u.deleted = false`;

export const GET_USER_PROJECT_PERMISSIONS = `select p.id, p.name from collaborators c
join project_role_permissions prp on prp.project_role_id = c.role_id
join permissions p on p.id = prp.permission_id
join projects pj on pj.id = c.project_id
where c.user_id = $1 and c.project_id = $2 and pj.deleted = false`;

export const GET_USERS = `select id, rol_id, username, '****' as "password", coalesce(profile_photo, '') as "profile_photo", coalesce(phone, '') as "phone", coalesce(email, '') as "email", public, banned, deleted, created_at, updated_at FROM users _1 ORDER BY created_at DESC OFFSET $1 LIMIT $2;`;

export const GET_USER_DETAILS = `select u.id, u.rol_id, u.username, '****' as "password", coalesce(u.profile_photo, '') as "profile_photo", coalesce(u.phone, '') as "phone", 
coalesce(u.email, '') as "email", u.public, u.banned, u.deleted, u.created_at, u.updated_at, coalesce(json_agg(distinct jsonb_build_object('id', s.id, 'name', s.name,
'created_at', s.created_at, 'updated_at', s.updated_at)) filter (where s.id is not null), '[]') as skills, coalesce(json_agg(distinct jsonb_build_object(
'id', t.id, 'name', t.name, 'created_at', t.created_at, 'updated_at', t.updated_at)) filter (where t.id is not null), '[]') as technologies, coalesce(json_agg(distinct jsonb_build_object(
'id', e.id, 'company_name', e.company_name, 'role', e.role, 'description', e.description, 'location', e.location, 'company_logo', coalesce(e.company_logo, ''),
'start_date', e.start_date, 'end_date', e.end_date, 'created_at', e.created_at, 'updated_at', e.updated_at)) filter (where e.id is not null), '[]') as experiences,
coalesce(json_agg(distinct jsonb_build_object('id', ed.id, 'start_date', ed.start_date, 'end_date', ed.end_date, 'institution', ed.institution, 'field', ed.field,
'location', ed.location, 'description', coalesce(ed.description, ''), 'created_at', ed.created_at, 'updated_at', ed.updated_at)) filter (where ed.id is not null), '[]') as educations
from users u left join users_skills us on us.user_id = u.id left join skills s on us.skill_id = s.id left join users_technologies ut on ut.user_id = u.id
left join technologies t on t.id = ut.technology_id left join experiences e on e.user_id = u.id left join educations ed on ed.user_id = u.id where u.id = $1 _1 group by u.id`;

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

export const CREATE_EDUCATION = `INSERT INTO educations (user_id, start_date, end_date, institution, field, "location", description, created_at, updated_at) 
select u.id, $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP from users u where u.id = $7 and u.deleted = false returning id, start_date, 
end_date, institution, field, location, coalesce(description, '') as description, created_at, updated_at`;

export const DELETE_EDUCATION = "DELETE FROM educations WHERE id = $1";

export const GET_EDUCATION_USER_ID =
  "SELECT user_id FROM educations WHERE id = $1 LIMIT 1";

export const PATCH_EDUCATION = `UPDATE educations SET start_date=COALESCE($1, start_date), end_date=COALESCE($2, end_date), institution=COALESCE($3, institution),
field=COALESCE($4, field), "location"=COALESCE($5, location), description=COALESCE($6, description) WHERE id=$7
returning id, start_date, end_date, institution, field, location, coalesce(description, '') as description, created_at, updated_at`;

export const ADD_USER_SKILL = `INSERT INTO users_skills (user_id, skill_id, created_at, updated_at) SELECT u.id, s.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u JOIN skills s ON s.id = $2 WHERE u.id = $1 AND u.deleted = false;`;

export const REMOVE_USER_SKILL = `DELETE from users_skills us USING users u WHERE us.user_id = u.id 
AND u.deleted = false AND us.skill_id = $2 AND u.id = $1`;

export const GET_SKILLS = `SELECT * FROM skills ORDER BY created_at DESC OFFSET $1 LIMIT $2`;

export const COUNT_SKILLS = `SELECT COUNT(*) AS total FROM skills`;

export const ADD_USER_TECHNOLOGY = `INSERT INTO users_technologies (user_id, technology_id, created_at, updated_at) SELECT u.id, t.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u JOIN technologies t ON t.id = $2 WHERE u.id = $1 AND u.deleted = false`;

export const REMOVE_USER_TECHNOLOGY = `DELETE from users_technologies ut USING users u WHERE ut.user_id = u.id AND u.deleted = false AND ut.technology_id = $2 AND u.id = $1`;

export const GET_TECHNOLOGIES = `SELECT * FROM technologies ORDER BY created_at DESC OFFSET $1 LIMIT $2`;

export const COUNT_TECHNOLOGIES = `SELECT COUNT(*) AS total FROM technologies`;

export const CREATE_PROJECT = `INSERT INTO projects(name, name_hash, description, status, public, start_date, end_date, estimated_end, key, deleted)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, name, coalesce(description, '') as description, status, public, start_date, end_date, estimated_end, '****' as key, deleted, 
created_at, updated_at`;

export const CREATE_COLLABORATOR = `INSERT INTO collaborators(project_id, user_id, role_id) SELECT p.id, u.id, $3 as role_id FROM users u, projects p
WHERE u.id = $2 AND u.deleted = FALSE and p.id = $1 and p.deleted = FALSE`;

export const SOFT_DELETE_PROJECT =
  "UPDATE projects SET deleted = true WHERE id = $1 AND deleted = false";

export const UPDATE_PROJECT = `UPDATE projects set name = COALESCE($1, name), name_hash = COALESCE($2, name_hash), description = COALESCE($3, description),
status = COALESCE($4, status), public = COALESCE($5, public), start_date = COALESCE($6, start_date), end_date = COALESCE($7, end_date),
estimated_end = COALESCE($8, estimated_end), updated_at = CURRENT_TIMESTAMP WHERE id=$9 RETURNING id, name, coalesce(description, '') as description, status, 
public, start_date, end_date, estimated_end, '****' as key, deleted, created_at, updated_at`;

export const GET_PROJECT_ENCRYPTED_FIELDS = `SELECT name, description, public, key FROM projects WHERE id = $1 FOR UPDATE`;

export const GET_PROJECT_KEY = `SELECT key FROM projects WHERE id = $1 AND deleted = FALSE`;

export const ADD_PROJECT_TECHNOLOGY = `INSERT INTO projects_technologies (project_id, technology_id, created_at, updated_at) SELECT p.id, t.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN technologies t ON t.id = $2 WHERE p.id = $1 AND p.deleted = false`;

export const REMOVE_PROJECT_TECHNOLOGY = `DELETE FROM projects_technologies pt USING projects p WHERE pt.project_id = p.id AND p.deleted = false
AND pt.technology_id = $2 AND p.id = $1`;

export const CHECK_VALID_USER_EXISTS = `SELECT count(*) FROM users WHERE id = $1 AND deleted = FALSE and banned = false LIMIT 1`;

export const CHECK_PROJECT_EXISTS = `SELECT count(*) FROM projects WHERE id = $1 AND deleted = FALSE LIMIT 1`;

export const CHECK_PROJECT_ROLE_EXISTS = `SELECT count(*) FROM project_roles WHERE id = $1 LIMIT 1`;

export const CREATE_BLOG = `INSERT INTO blogs (user_id, project_id, title, body, deleted)
select $1, p.id, $3, $4, false from projects p where p.id = $2 and p.deleted = false RETURNING *`;
