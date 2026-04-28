update public.orders
set status = 'pending'
where status is null
  or status not in ('pending', 'paid', 'shipped');

alter table public.orders
  alter column status set default 'pending';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_status_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_status_check
      check (status in ('pending', 'paid', 'shipped'));
  end if;
end $$;
