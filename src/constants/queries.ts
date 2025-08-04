export const CREATE_USER_NO_CONFLICT = `INSERT INTO users (rol_id, username, password, profile_photo, phone, 
email, public, banned, deleted, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) on conflict do nothing;`;

export const GET_USER_CREDENTIALS =
  "SELECT id, username, password from users WHERE username = $1";
