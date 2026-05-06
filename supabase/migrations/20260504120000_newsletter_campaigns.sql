-- Newsletter / campaign drafts and send metadata (emails sent via Resend from app API).

create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft', 'sent')),
  sent_count int not null default 0,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_campaigns_status_idx on public.newsletter_campaigns (status);
create index if not exists newsletter_campaigns_created_at_idx on public.newsletter_campaigns (created_at desc);

alter table public.newsletter_campaigns enable row level security;

drop policy if exists newsletter_campaigns_admin_all on public.newsletter_campaigns;
create policy newsletter_campaigns_admin_all on public.newsletter_campaigns
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke all on public.newsletter_campaigns from anon;
grant select, insert, update, delete on public.newsletter_campaigns to authenticated;

create or replace function public.set_newsletter_campaigns_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists newsletter_campaigns_set_updated_at on public.newsletter_campaigns;
create trigger newsletter_campaigns_set_updated_at
  before update on public.newsletter_campaigns
  for each row execute function public.set_newsletter_campaigns_updated_at();
