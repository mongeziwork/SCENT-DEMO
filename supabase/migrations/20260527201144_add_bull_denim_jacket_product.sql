insert into public.products (
  name,
  slug,
  description,
  price,
  image_url,
  stock,
  is_active,
  category,
  color_options,
  size_options,
  updated_at
)
values (
  'Bull Denim Jacket',
  'bull-denim-jacket',
  'A heavyweight bull denim jacket with a relaxed baggy fit, ribbed cuffs, and an adjustable waist elastic strip for a custom fit.',
  900,
  null,
  1,
  true,
  'outerwear',
  '{}'::text[],
  '{}'::text[],
  now()
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  image_url = coalesce(public.products.image_url, excluded.image_url),
  stock = greatest(public.products.stock, excluded.stock),
  is_active = excluded.is_active,
  category = excluded.category,
  color_options = excluded.color_options,
  size_options = excluded.size_options,
  updated_at = now();
