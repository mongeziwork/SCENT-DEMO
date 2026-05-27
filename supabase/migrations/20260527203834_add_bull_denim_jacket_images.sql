alter table public.products
  add column if not exists gallery_image_urls text[] not null default '{}'::text[];

update public.products
set
  image_url = '/images/bull-denim-jacket-1.jpg',
  gallery_image_urls = array[
    '/images/bull-denim-jacket-1.jpg',
    '/images/bull-denim-jacket-2.jpg',
    '/images/bull-denim-jacket-3.jpg',
    '/images/bull-denim-jacket-4.jpg',
    '/images/bull-denim-jacket-5.jpg',
    '/images/bull-denim-jacket-6.jpg'
  ]::text[],
  updated_at = now()
where slug = 'bull-denim-jacket';
