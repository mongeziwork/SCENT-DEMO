create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- After running this migration, add your Supabase Auth email:
-- insert into public.admin_users (email) values ('you@example.com')
-- on conflict (email) do nothing;

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='admin_users' and policyname='admin_users_select_self'
  ) then
    create policy admin_users_select_self on public.admin_users
      for select
      to authenticated
      using (public.is_admin());
  end if;
end $$;

drop policy if exists products_insert on public.products;
drop policy if exists products_update on public.products;
drop policy if exists products_delete on public.products;
drop policy if exists products_insert_admin on public.products;
drop policy if exists products_update_admin on public.products;
drop policy if exists products_delete_admin on public.products;

create policy products_insert_admin on public.products
  for insert
  to authenticated
  with check (public.is_admin());

create policy products_update_admin on public.products
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy products_delete_admin on public.products
  for delete
  to authenticated
  using (public.is_admin());

drop policy if exists orders_select on public.orders;
drop policy if exists orders_update on public.orders;
drop policy if exists orders_select_admin on public.orders;
drop policy if exists orders_update_admin on public.orders;

create policy orders_select_admin on public.orders
  for select
  to authenticated
  using (public.is_admin());

create policy orders_update_admin on public.orders
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists order_items_select on public.order_items;
drop policy if exists order_items_select_admin on public.order_items;

create policy order_items_select_admin on public.order_items
  for select
  to authenticated
  using (public.is_admin());
