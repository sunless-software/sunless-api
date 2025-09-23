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

export const GET_USERS = `select id, rol_id, username, '****' as "password", coalesce(profile_photo, '') as "profile_photo", 
coalesce(phone, '') as "phone", coalesce(email, '') as "email", coalesce(short_description, '') as "short_description", job_title, public, deleted, 
banned, created_at, updated_at FROM users u where ($1::boolean IS TRUE OR u.public = TRUE) and ($2::boolean IS TRUE OR u.banned = FALSE) and 
($3::boolean IS TRUE OR u.deleted = FALSE) and ($4::text IS NULL OR username ILIKE '%' || $4 || '%') ORDER BY created_at DESC OFFSET $5 LIMIT $6`;

export const GET_USER_DETAILS = `select u.id, u.rol_id, u.username, '****' as "password", coalesce(u.profile_photo, '') as "profile_photo",
coalesce(u.phone, '') as "phone", coalesce(u.email, '') as "email", coalesce(u.short_description, '') as "short_description", job_title, u.public, 
u.deleted, u.banned, u.created_at, u.updated_at, coalesce(up.long_description, '') as long_description, coalesce(up.repo_url, '') as repo_url,
coalesce(up.website_url, '') as website_url, coalesce(up.linkedin_url, '') as linkedin_url, coalesce(up.location, '') as location,
coalesce(json_agg(distinct jsonb_build_object('id', s.id, 'name', s.name, 'created_at', s.created_at, 'updated_at', s.updated_at)) filter (where s.id is not null), '[]') 
as skills, coalesce(json_agg(distinct jsonb_build_object( 'id', t.id, 'name', t.name, 'created_at', t.created_at, 'updated_at', t.updated_at)) filter 
(where t.id is not null), '[]') as technologies, coalesce(json_agg(distinct jsonb_build_object('id', e.id, 'company_name', e.company_name, 'role', e.role, 
'description', e.description, 'location', e.location, 'company_logo', coalesce(e.company_logo, ''), 'start_date', e.start_date, 'end_date', e.end_date, 
'created_at', e.created_at, 'updated_at', e.updated_at)) filter (where e.id is not null), '[]') as experiences, coalesce(json_agg(distinct 
jsonb_build_object('id', ed.id, 'start_date', ed.start_date, 'end_date', ed.end_date, 'institution', ed.institution, 'field', ed.field, 'location', ed.location, 
'description', coalesce(ed.description, ''), 'created_at', ed.created_at, 'updated_at', ed.updated_at)) filter (where ed.id is not null), '[]') as 
educations from users u left join users_skills us on us.user_id = u.id left join skills s on us.skill_id = s.id left join users_technologies ut on 
ut.user_id = u.id left join user_profiles up on up.user_id = u.id left join technologies t on t.id = ut.technology_id left join experiences e on
e.user_id = u.id left join educations ed on ed.user_id = u.id where u.id = $1 and ($2::boolean IS TRUE OR u.public = TRUE) and 
($3::boolean IS TRUE OR u.banned = FALSE) and ($4::boolean IS TRUE OR u.deleted = FALSE) group by u.id, up.user_id`;

export const COUNT_USERS = `SELECT COUNT(*) AS total FROM users u where ($1::boolean IS TRUE OR u.public = TRUE) and
($2::boolean IS TRUE OR u.banned = FALSE) and ($3::boolean IS TRUE OR u.deleted = FALSE) and ($4::text IS NULL OR username ILIKE '%' || $4 || '%')`;

export const GET_USER_STATUS = `SELECT banned FROM users WHERE id = $1 AND deleted = false LIMIT 1`;

export const CREATE_USER = `INSERT INTO users (rol_id, username, password, profile_photo, phone, email, short_description, job_title, public, banned, deleted) 
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, rol_id, username, '****' as "password", coalesce(profile_photo, '') as "profile_photo", 
coalesce(phone, '') as "phone", coalesce(email, '') as "email", coalesce(short_description, '') as "short_description", job_title, public, deleted, banned, 
created_at, updated_at`;

export const SOFT_DELETE_USER = `UPDATE users SET deleted = true WHERE id = $1 AND deleted = false`;

export const RECOVER_USER = `UPDATE users SET deleted = false WHERE id = $1`;

export const BAN_USER = `UPDATE users SET banned = true WHERE id = $1 AND deleted = false`;

export const UNBAN_USER = `UPDATE users SET banned = false WHERE id = $1 AND deleted = false`;

export const UPDATE_USER_ROLE = `UPDATE users SET rol_id = $1 WHERE id = $2 AND deleted = false`;

export const PATCH_USER = `UPDATE users SET username = COALESCE($1, username), profile_photo = COALESCE($2, profile_photo), phone = COALESCE($3, phone),
email = COALESCE($4, email), short_description = COALESCE($5, short_description), job_title = COALESCE($6, job_title), public = COALESCE($7, public)
WHERE id = $8 and deleted = false RETURNING id, rol_id, username, '****' as "password", coalesce(profile_photo, '') as "profile_photo", 
coalesce(phone, '') as "phone", coalesce(email, '') as "email", coalesce(short_description, '') as "short_description", job_title, public, deleted, 
banned, created_at, updated_at`;

export const CREATE_EXPERIENCE = `INSERT INTO experiences (user_id, company_name, "role", description, "location", start_date, end_date, 
company_logo, created_at, updated_at) select u.id, $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP from users u
where u.id = $8 and u.deleted = false RETURNING id, user_id, company_name, role, description, location, start_date, end_date, coalesce(company_logo, '') as "company_logo", created_at, updated_at`;

export const PATCH_EXPERIENCE = `UPDATE experiences SET company_name=COALESCE($1, company_name), role=COALESCE($2, role), description=COALESCE($3, description), 
location=COALESCE($4, location), start_date=COALESCE($5, start_date), end_date=COALESCE($6, end_date), company_logo=COALESCE($7, company_logo) WHERE id=$8
and exists (select 1 from users u where u.id = $9 and u.deleted = false) RETURNING id, user_id, company_name, role, description, location, start_date, 
end_date, coalesce(company_logo, '') as "company_logo", created_at, updated_at`;

export const DELETE_EXPERIENCE = `DELETE FROM experiences e USING users u WHERE e.id = $1 AND u.id = $2 AND u.deleted = false`;

export const GET_EXPERIENCE_USER_ID =
  "SELECT user_id FROM experiences WHERE id = $1 LIMIT 1";

export const CREATE_EDUCATION = `INSERT INTO educations (user_id, start_date, end_date, institution, field, "location", description, created_at, updated_at) 
select u.id, $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP from users u where u.id = $7 and u.deleted = false returning id, start_date, 
end_date, institution, field, location, coalesce(description, '') as description, created_at, updated_at`;

export const DELETE_EDUCATION =
  "DELETE FROM educations e USING users u WHERE e.id = $1 AND u.id = $2 AND u.deleted = FALSE";

export const GET_EDUCATION_USER_ID =
  "SELECT user_id FROM educations WHERE id = $1 LIMIT 1";

export const PATCH_EDUCATION = `UPDATE educations SET start_date=COALESCE($1, start_date), end_date=COALESCE($2, end_date), institution=COALESCE($3, institution),
field=COALESCE($4, field), "location"=COALESCE($5, location), description=COALESCE($6, description) WHERE id=$7 and exists (select 1 from users u where
u.id = $8 and u.deleted = false) returning id, start_date, end_date, institution, field, location, coalesce(description, '') as description, 
created_at, updated_at`;

export const ADD_USER_SKILL = `INSERT INTO users_skills (user_id, skill_id, created_at, updated_at) SELECT u.id, s.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u JOIN skills s ON s.id = $2 WHERE u.id = $1 AND u.deleted = false`;

export const REMOVE_USER_SKILL = `DELETE from users_skills us USING users u WHERE us.user_id = u.id 
AND u.deleted = false AND us.skill_id = $2 AND u.id = $1`;

export const GET_SKILLS = `SELECT * FROM skills ORDER BY created_at DESC OFFSET $1 LIMIT $2`;

export const CREATE_SKILL = `INSERT INTO skills (name) VALUES($1) RETURNING *`;

export const UPDATE_SKILL = `UPDATE skills SET name=$1 WHERE id=$2 RETURNING *`;

export const COUNT_SKILLS = `SELECT COUNT(*) AS total FROM skills`;

export const ADD_USER_TECHNOLOGY = `INSERT INTO users_technologies (user_id, technology_id, created_at, updated_at) SELECT u.id, t.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u JOIN technologies t ON t.id = $2 WHERE u.id = $1 AND u.deleted = false`;

export const REMOVE_USER_TECHNOLOGY = `DELETE from users_technologies ut USING users u WHERE ut.user_id = u.id AND u.deleted = false AND ut.technology_id = $2 AND u.id = $1`;

export const GET_TECHNOLOGIES = `SELECT * FROM technologies ORDER BY created_at DESC OFFSET $1 LIMIT $2`;

export const COUNT_TECHNOLOGIES = `SELECT COUNT(*) AS total FROM technologies`;

export const CREATE_TECHNOLOGY = `INSERT INTO technologies (name) VALUES($1) RETURNING *`;

export const UPDATE_TECHNOLOGY = `UPDATE technologies SET name=$1 WHERE id=$2 RETURNING *`;

export const CREATE_PROJECT = `INSERT INTO projects(name, name_hash, short_description, long_description, logo, status, public, start_date, end_date, 
estimated_end, key, deleted) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id, name, coalesce(short_description, '') as short_description, 
coalesce(long_description, '') as long_description, coalesce(logo, '') as logo, status, public, start_date, end_date, estimated_end, '[]'::jsonb as tags,
$13::integer as creator_id, created_at, updated_at`;

export const CREATE_COLLABORATOR = `INSERT INTO collaborators(project_id, user_id, role_id) SELECT p.id, u.id, $3 as role_id FROM users u, projects p
WHERE u.id = $2 AND u.deleted = FALSE and p.id = $1 and p.deleted = FALSE`;

export const SOFT_DELETE_PROJECT =
  "UPDATE projects SET deleted = true WHERE id = $1 AND deleted = false";

export const UPDATE_PROJECT = `UPDATE projects set name = COALESCE($1, name), name_hash = COALESCE($2, name_hash), short_description = COALESCE($3, short_description),
long_description = COALESCE($4, long_description), logo = COALESCE($5, logo), status = COALESCE($6, status), public = COALESCE($7, public), start_date = COALESCE($8, start_date), 
end_date = COALESCE($9, end_date), estimated_end = COALESCE($10, estimated_end), updated_at = CURRENT_TIMESTAMP WHERE id=$11 AND deleted = FALSE 
RETURNING id, name, coalesce(short_description, '') as short_description, coalesce(long_description, '') as long_description, coalesce(logo, '') as logo, status, 
public, start_date, end_date, estimated_end, created_at, updated_at`;

export const GET_PROJECT_KEY = `SELECT key FROM projects WHERE id = $1 AND deleted = FALSE`;

export const ADD_PROJECT_TECHNOLOGY = `INSERT INTO projects_technologies (project_id, technology_id, created_at, updated_at) SELECT p.id, t.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN technologies t ON t.id = $2 WHERE p.id = $1 AND p.deleted = false`;

export const REMOVE_PROJECT_TECHNOLOGY = `DELETE FROM projects_technologies pt USING projects p WHERE pt.project_id = p.id AND p.deleted = false
AND pt.technology_id = $2 AND p.id = $1`;

export const CHECK_VALID_INVITATION = `SELECT 1 FROM users WHERE id = $1 AND deleted = FALSE AND EXISTS (SELECT 1 FROM projects WHERE id = $2 
AND deleted = FALSE) AND EXISTS (SELECT 1 FROM project_roles WHERE id = $3)`;

export const CREATE_BLOG = `INSERT INTO blogs (user_id, project_id, title, body)
select $1, p.id, $3, $4 from projects p where p.id = $2 and p.deleted = false RETURNING *`;

export const DELETE_BLOG = `DELETE FROM blogs b USING projects p
WHERE p.deleted = FALSE AND p.id = $2 AND b.id = $1`;

export const UPDATE_BLOGS = `UPDATE blogs SET title = COALESCE($1, title), body = COALESCE($2, body) WHERE id = $3 
AND EXISTS(SELECT 1 FROM projects p WHERE p.id = $4 AND p.deleted = FALSE) RETURNING *`;

export const CREATE_TAG = `INSERT INTO tags (name) VALUES($1) RETURNING *`;

export const UPDATE_TAG = `UPDATE tags SET name=$1 WHERE id=$2 RETURNING *`;

export const GET_TAGS = `SELECT * FROM tags ORDER BY created_at DESC OFFSET $1 LIMIT $2`;

export const COUNT_TAGS = `SELECT COUNT(*) as total FROM tags`;

export const ADD_PROJECT_TAG = `INSERT INTO project_tags (tag_id, project_id) SELECT t.id, p.id FROM tags t
JOIN projects p ON p.id = $1 AND p.deleted = FALSE AND t.id = $2 RETURNING *`;

export const REMOVE_PROJECT_TAG = `DELETE FROM project_tags pt USING projects p
WHERE p.deleted = FALSE AND p.id = $1 AND pt.tag_id = $2`;

export const CREATE_PROJECT_EXTERNAL_RESOURCE = `INSERT INTO external_resources (project_id, name, url, url_hash, type)
SELECT p.id, $2, $3, $4, $5 from projects p where p.id = $1 and p.deleted = false RETURNING *`;

export const UPDATE_PROJECT_EXTERNAL_RESOURCE = `UPDATE external_resources SET name=COALESCE($3, name), url=COALESCE($4, url), url_hash=COALESCE($5, url_hash),
type=COALESCE($6, type) WHERE id = $2 and EXISTS (SELECT 1 FROM projects p WHERE p.id = $1 AND p.deleted = false) RETURNING *`;

export const DELETE_PROJECT_EXTERNAL_RESOURCE = `DELETE FROM external_resources er USING projects p
where p.id = $1 AND p.deleted = FALSE AND er.id = $2`;

export const CREATE_PROJECT_MEDIA = `INSERT INTO projects_media (url, url_hash, type, project_id)
SELECT $2, $3, $4, p.id FROM projects p WHERE p.id = $1 AND p.deleted = FALSE RETURNING *`;

export const UPDATE_PROJECT_MEDIA = `UPDATE projects_media SET url = COALESCE($1, url), url_hash = COALESCE($2, url_hash), type = COALESCE($3, type) WHERE id = $4
AND EXISTS (SELECT 1 FROM projects p WHERE p.id = $5 AND p.deleted = FALSE) RETURNING *`;

export const DELETE_PROJECT_MEDIA = `DELETE from projects_media pm USING projects p
WHERE p.id = $1 AND p.deleted = false AND pm.id = $2`;

export const GET_PROJECTS_BY_USER = `SELECT p.id, p.name, p.short_description, p.long_description, p.logo, p.status, p.public, p.start_date,
p.end_date, p.estimated_end, p.key, coalesce(json_agg(distinct jsonb_build_object('id', t.id, 'name', t.name, 'created_at',
t.created_at, 'updated_at', t.updated_at)) filter (where t.id is not null), '[]') as tags, CASE WHEN c2.user_id IS NOT NULL 
THEN true ELSE false END AS is_collaborator, $1::int as creator_id, p.created_at, p.updated_at
FROM projects p JOIN collaborators c ON c.project_id = p.id JOIN users u ON u.id = c.user_id JOIN 
project_roles pr ON pr.id = c.role_id LEFT JOIN collaborators c2 ON c2.project_id = p.id AND c2.user_id = $2 LEFT JOIN project_tags pt ON 
pt.project_id = p.id LEFT JOIN tags t ON t.id = pt.tag_id WHERE p.deleted = false AND c.user_id = $1 AND pr.id = 1 AND u.deleted = FALSE AND 
($3::boolean IS TRUE OR p.public = TRUE) GROUP BY p.id, c2.user_id HAVING (array_length($6::int[], 1) IS NULL OR $6::int[] <@ array_agg(t.id)
) ORDER BY p.created_at DESC OFFSET $4 LIMIT $5`;

export const COUNT_PROJECTS_FROM_USER = `SELECT count(*) AS total FROM projects p JOIN collaborators c on c.user_id = p.id
WHERE c.role_id = 1 AND c.user_id = $1 AND p.deleted = FALSE`;

export const GET_ALL_PROJECTS = `SELECT p.*, coalesce(json_agg(distinct jsonb_build_object('id', t.id,'name', t.name,'created_at', t.created_at,
'updated_at', t.updated_at)) filter (where t.id is not null), '[]') as tags, CASE WHEN c2.user_id IS NOT NULL THEN true ELSE false END AS is_collaborator,
MIN(c_creator.user_id) AS creator_id FROM projects p LEFT JOIN collaborators c2 ON c2.project_id = p.id AND c2.user_id = $1 LEFT JOIN project_tags 
pt ON pt.project_id = p.id left join collaborators c_creator on c_creator.project_id = p.id and c_creator.role_id = 1 LEFT JOIN tags t 
ON t.id = pt.tag_id WHERE p.deleted = false AND ($2::boolean IS TRUE OR p.public = TRUE) GROUP BY p.id, c2.user_id HAVING (array_length($5::int[], 1) 
IS NULL OR $5::int[] <@ array_agg(t.id)) ORDER BY p.created_at DESC OFFSET $3 LIMIT $4`;

export const COUNT_ALL_PROJECTS = `SELECT count(*) AS total FROM projects p WHERE p.deleted = FALSE`;

export const GET_PROJECT_DETAILS = `select p.*, json_agg(jsonb_build_object('id', c.user_id,'project_role_id', c.role_id, 'project_role_name', pr.role_name, 
'username', u.username,'profile_photo', coalesce(u.profile_photo, ''))) as collaborators, coalesce(json_agg(distinct jsonb_build_object('id', t.id,
'name', t.name)) filter (where t.id is not null), '[]') as tags,coalesce(json_agg(distinct jsonb_build_object('id', tc.id,'name', tc.name)) filter 
(where tc.id is not null), '[]') as technologies, coalesce(json_agg(distinct jsonb_build_object('id', pm.id,'url', pm.url,
'type', pm.type)) filter (where pm.id is not null), '[]') as media,coalesce(json_agg(distinct jsonb_build_object('id', er.id,'name', er.name,'url', er.url,
'type', er.type)) filter (where er.id is not null), '[]') as external_resources from projects p join collaborators c on c.project_id = p.id
join project_roles pr on pr.id = c.role_id join users u on u.id = c.user_id left join project_tags pt on pt.project_id = p.id left join tags t on t.id = pt.tag_id
left join projects_technologies ptc on ptc.project_id = p.id left join technologies tc on tc.id = ptc.technology_id left join projects_media pm on 
pm.project_id = p.id left join external_resources er on er.project_id  = p.id left join collaborators c2 on c2.project_id = p.id and c2.role_id = 1
join users u2 on u2.id = c2.user_id and u2.deleted = false where p.id = $1 and p.deleted = false group by p.id`;

export const GET_BLOGS_FROM_USER = `select b.*, p.public, p."key", array_agg(c.user_id ) as collaborators from blogs b join users u on u.id = b.user_id 
and u.deleted = false join projects p on p.id = b.project_id and p.deleted = false join collaborators c on c.project_id = p.id join users u2 on 
u2.id = c.user_id and u2.deleted = false where u.id = $1 and ($2::boolean IS TRUE OR p.public = TRUE) group by b.id, p.public, p.key
order by b.created_at desc offset $3 limit $4`;

export const GET_BLOGS_FROM_PROJECT = `select b.*, p.public, p."key", array_agg(c.user_id ) as collaborators from blogs b join users u on u.id = b.user_id 
and u.deleted = false join projects p on p.id = b.project_id and p.deleted = false join collaborators c on c.project_id = p.id join users u2 on 
u2.id = c.user_id and u2.deleted = false where p.id = $1 group by b.id, p.public, p.key order by b.created_at desc offset $2 limit $3`;

export const COUNT_BLOGS_FROM_USER = `select count (*) as total from blogs b join users u on u.id = b.user_id and u.deleted = false join projects p on
p.id = b.project_id and p.deleted = false where u.id = $1`;

export const COUNT_BLOGS_FROM_PROJECT = `select count (*) as total from blogs b join users u on u.id = b.user_id and u.deleted = false join projects p on
p.id = b.project_id and p.deleted = false where p.id = $1`;

export const CREATE_USER_PROFILE = `INSERT INTO user_profiles (user_id) SELECT u.id FROM users u WHERE u.id = $1 AND u.deleted = FALSE`;

export const UPDATE_USER_PROFILE = `UPDATE user_profiles up SET long_description=COALESCE($1, long_description), repo_url=COALESCE($2, repo_url), 
website_url=COALESCE($3, website_url), linkedin_url=COALESCE($4, linkedin_url), location=COALESCE($5, location) WHERE up.user_id = $6 AND EXISTS 
(SELECT 1 FROM users u WHERE u.deleted = FALSE AND u.id = up.user_id) RETURNING user_id, COALESCE(long_description, '') as long_description, 
COALESCE(repo_url, '') as repo_url, COALESCE(website_url, '') as website_url, COALESCE(linkedin_url, '') as linkedin_url, 
COALESCE(location, '') as location, created_at, updated_at`;

export const CREATE_GLOBAL_ROLE = `INSERT INTO global_roles (role_name) VALUES($1) RETURNING *`;

export const RELATE_GLOBAL_ROLE_PERMISSIONS = `INSERT INTO global_role_permissions (global_role_id, permission_id)
SELECT $1, p.id FROM permissions p WHERE p.id = ANY($2::int[]) AND p.scope = 'GLOBAL' RETURNING *`;

export const UPDATE_GLOBAL_ROLE = `UPDATE global_roles SET role_name=COALESCE($1, role_name) WHERE id = $2 RETURNING *`;

export const DELETE_GLOBAL_ROLE_PERMISSIONS = `DELETE FROM global_role_permissions WHERE global_role_id = $1`;

export const GET_GLOBAL_ROLE_PERMISSIONS_ID = `SELECT permission_id FROM global_role_permissions WHERE global_role_id = $1`;

export const GET_PERMISSIONS = `SELECT * FROM permissions p WHERE ($1::boolean IS FALSE or p.scope = 'GLOBAL')
ORDER by p.created_at DESC OFFSET $2 LIMIT $3`;

export const COUNT_PERMISSIONS = `SELECT count(*) AS total FROM permissions p WHERE ($1::boolean IS FALSE OR p.scope = 'GLOBAL')`;

export const CREATE_PROJECT_ROLE = `INSERT INTO project_roles (role_name) VALUES($1) RETURNING *`;

export const RELATE_PROJECT_ROLE_PERMISSIONS = `INSERT INTO project_role_permissions (project_role_id, permission_id)
SELECT $1, p.id FROM permissions p WHERE p.id = ANY($2::int[]) AND p.scope = 'PROJECT' RETURNING *`;
