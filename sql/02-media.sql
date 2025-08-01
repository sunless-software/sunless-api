create table if not exists media (
  id SERIAL primary key,
  url TEXT not null,
  type_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  constraint fk_media_type foreign key (type_id) references media_types(id)
);