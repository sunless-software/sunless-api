export const GET_USER_CREDENTIALS =
  "SELECT id, username, password from users WHERE username = $1";

export const GET_USER_PERMISSIONS = `select p.name, p.scope from users u
join global_role_permissions grp on u.rol_id = grp.global_role_id 
join permissions p on grp.permission_id = p.id
where u.id = $1`;
