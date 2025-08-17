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
