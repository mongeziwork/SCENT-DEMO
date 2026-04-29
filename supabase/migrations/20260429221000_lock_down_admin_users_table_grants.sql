-- admin_users should not be writable by anon (or generally by clients).
revoke insert, update, delete, truncate, references, trigger on public.admin_users from anon;
revoke insert, update, delete, truncate, references, trigger on public.admin_users from authenticated;
grant select on public.admin_users to authenticated;
