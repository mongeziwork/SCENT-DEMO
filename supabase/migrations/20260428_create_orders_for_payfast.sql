create table if not exists public.orders (
  id uuid primary key default extensions.uuid_generate_v4(),
  status text not null default 'created',
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

alter table public.order_items enable row level security;
alter table public.orders enable row level security;

-- Early iteration: allow inserts/reads without auth.
-- Tighten later (auth + ownership + admin roles).
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

