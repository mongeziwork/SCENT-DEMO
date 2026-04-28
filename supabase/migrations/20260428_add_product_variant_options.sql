alter table public.products
  add column if not exists color_options text[] not null default '{}'::text[],
  add column if not exists size_options text[] not null default '{}'::text[];

