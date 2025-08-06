export const CREATE_USER_NO_CONFLICT = `INSERT INTO users (rol_id, username, password, profile_photo, phone, 
email, public, banned, deleted, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) on conflict do nothing;`;

export const GET_USER_CREDENTIALS =
  "SELECT id, username, password from users WHERE username = $1";

export const GET_USER_PERMISSIONS = `select p.name from users u
join global_role_permissions grp on u.rol_id = grp.global_role_id 
join permissions p on grp.permission_id = p.id
where u.id = $1`;

export const CREATE_ROLE = `INSERT INTO permissions ("name", "scope", created_at, updated_at) 
VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
