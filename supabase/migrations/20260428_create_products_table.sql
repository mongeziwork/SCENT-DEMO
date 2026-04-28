create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  description text,
  price numeric not null default 0,
  image_url text,
  stock int not null default 0,
  is_active boolean not null default true,
  category text,
  color_options text[] not null default '{}'::text[],
  size_options text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists name text,
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists price numeric not null default 0,
  add column if not exists image_url text,
  add column if not exists stock int not null default 0,
  add column if not exists is_active boolean not null default true,
  add column if not exists category text,
  add column if not exists color_options text[] not null default '{}'::text[],
  add column if not exists size_options text[] not null default '{}'::text[],
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists products_slug_key
  on public.products(slug)
  where slug is not null;

alter table public.products enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='products_select'
  ) then
    create policy products_select on public.products for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='products_insert'
  ) then
    create policy products_insert on public.products for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='products_update'
  ) then
    create policy products_update on public.products for update using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='products_delete'
  ) then
    create policy products_delete on public.products for delete using (true);
  end if;
end $$;
