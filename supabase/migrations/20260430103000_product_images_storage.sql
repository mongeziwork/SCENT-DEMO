-- Supabase Storage bucket + policies for product images.
-- Images are public-read, but only authenticated admins can write.

-- Create (or ensure) a public bucket for product images.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

-- Public can read images from this bucket.
drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read
  on storage.objects
  for select
  to public
  using (bucket_id = 'product-images');

-- Only admins can write to this bucket.
drop policy if exists product_images_admin_insert on storage.objects;
create policy product_images_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists product_images_admin_update on storage.objects;
create policy product_images_admin_update
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists product_images_admin_delete on storage.objects;
create policy product_images_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

