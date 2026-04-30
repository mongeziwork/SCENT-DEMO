-- Marketing subscribers table and automatic capture of new user emails.
-- Stores only what's needed for email marketing and dedupes by email.

create table if not exists public.marketing_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'signup',
  status text not null default 'subscribed',
  created_at timestamptz not null default now()
);

alter table public.marketing_subscribers enable row level security;

-- Admin-only read access (uses existing is_admin()).
drop policy if exists marketing_subscribers_select_admin on public.marketing_subscribers;
create policy marketing_subscribers_select_admin on public.marketing_subscribers
  for select
  to authenticated
  using (public.is_admin());

-- Prevent client-side writes; inserts happen via trigger (security definer).
revoke insert, update, delete, truncate, references, trigger on public.marketing_subscribers from anon;
revoke insert, update, delete, truncate, references, trigger on public.marketing_subscribers from authenticated;
grant select on public.marketing_subscribers to authenticated;

create or replace function public.capture_marketing_subscriber()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is not null and length(trim(new.email)) > 0 then
    insert into public.marketing_subscribers (email, source)
    values (lower(trim(new.email)), 'signup')
    on conflict (email) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_capture_marketing on auth.users;
create trigger on_auth_user_created_capture_marketing
  after insert on auth.users
  for each row execute function public.capture_marketing_subscriber();

