export const GET_USER_CREDENTIALS =
  "SELECT id, username, password from users WHERE username = $1";

export const GET_USER_PERMISSIONS = `select p.id, p.name, p.scope from users u
join global_role_permissions grp on u.rol_id = grp.global_role_id 
join permissions p on grp.permission_id = p.id
where u.id = $1`;

export const GET_USERS = `SELECT * FROM users _1 ORDER BY created_at DESC OFFSET $1 LIMIT $2;`;

export const CREATE_USER = `INSERT INTO users (rol_id, username, "password", profile_photo, phone, email, public, banned, deleted, created_at, updated_at)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`;

export const SOFT_DELETE_USER = `UPDATE users SET deleted = TRUE WHERE id = $1`;
