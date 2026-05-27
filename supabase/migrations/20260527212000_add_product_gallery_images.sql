alter table public.products
  add column if not exists gallery_image_urls text[] not null default '{}'::text[];

update public.products
set gallery_image_urls = array[image_url]
where image_url is not null
  and image_url <> ''
  and cardinality(gallery_image_urls) = 0;
