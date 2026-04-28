create extension if not exists "uuid-ossp" with schema extensions;

create table if not exists public.orders (
  id uuid primary key default extensions.uuid_generate_v4(),
  status text not null default 'pending',
  currency text not null default 'ZAR',
  subtotal numeric not null default 0,
  total numeric not null default 0,
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  payfast_payment_id text,
  payfast_m_payment_id text,
  payfast_pf_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default extensions.uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  name text not null,
  slug text,
  price numeric not null,
  quantity int not null check (quantity > 0),
  color text,
  size text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists status text not null default 'pending',
  add column if not exists currency text not null default 'ZAR',
  add column if not exists subtotal numeric not null default 0,
  add column if not exists total numeric not null default 0,
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists shipping_address text,
  add column if not exists payfast_payment_id text,
  add column if not exists payfast_m_payment_id text,
  add column if not exists payfast_pf_payment_id text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.order_items
  add column if not exists order_id uuid references public.orders(id) on delete cascade,
  add column if not exists product_id uuid references public.products(id),
  add column if not exists name text,
  add column if not exists slug text,
  add column if not exists price numeric,
  add column if not exists quantity int,
  add column if not exists color text,
  add column if not exists size text,
  add column if not exists image_url text,
  add column if not exists created_at timestamptz not null default now();

update public.orders
set status = 'pending'
where status is null
  or status not in ('pending', 'paid', 'shipped');

alter table public.orders
  alter column status set default 'pending';

alter table public.orders
  drop constraint if exists orders_status_check,
  add constraint orders_status_check
  check (status in ('pending', 'paid', 'shipped'));

alter table public.order_items
  drop constraint if exists order_items_quantity_check,
  add constraint order_items_quantity_check
  check (quantity > 0);

alter table public.order_items enable row level security;
alter table public.orders enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='orders' and policyname='orders_select'
  ) then
    create policy orders_select on public.orders for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='orders' and policyname='orders_insert'
  ) then
    create policy orders_insert on public.orders for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='orders' and policyname='orders_update'
  ) then
    create policy orders_update on public.orders for update using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='order_items' and policyname='order_items_select'
  ) then
    create policy order_items_select on public.order_items for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='order_items' and policyname='order_items_insert'
  ) then
    create policy order_items_insert on public.order_items for insert with check (true);
  end if;
end $$;
