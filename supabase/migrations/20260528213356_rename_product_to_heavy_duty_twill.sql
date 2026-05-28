update public.products
set
  name = 'SCENT Heavy Duty Twill Zip Sweater',
  description = 'A heavy duty twill jacket with a relaxed baggy fit, ribbed cuffs, and an adjustable waist elastic strip for a custom fit.',
  updated_at = now()
where slug = 'bull-denim-jacket';
