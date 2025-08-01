create table if not exists user_roles (
  user_id INTEGER not null,
  role_id INTEGER not null,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  primary key (user_id, role_id),
  foreign key (user_id) references users(id),
  foreign key (role_id) references roles(id)
);