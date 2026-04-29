-- Fix circular RLS on admin_users: is_admin() reads admin_users, so the old policy
-- (select using is_admin()) could never bootstrap for a first-time admin.
-- Allow authenticated users to read only their own allowlist row by JWT email.

drop policy if exists admin_users_select_self on public.admin_users;

create policy admin_users_select_self on public.admin_users
  for select
  to authenticated
  using (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Optional: add commonly-used admin accounts (safe upsert)
insert into public.admin_users (email)
values ('nkosiimo@gmail.com')
on conflict (email) do nothing;
