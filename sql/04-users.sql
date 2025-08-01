create table if not exists users (
  id SERIAL primary key,
  username VARCHAR(255) unique not null,
  password VARCHAR(255) not null,
  pfp_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  constraint fk_pfp foreign key (pfp_id) references media(id)
);