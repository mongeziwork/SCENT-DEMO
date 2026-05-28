alter table public.orders
  add column if not exists is_first_purchase boolean not null default false,
  add column if not exists free_gift_included boolean not null default false;

comment on column public.orders.is_first_purchase is 'True when this order was created for a customer email with no previous paid or shipped orders.';
comment on column public.orders.free_gift_included is 'True when the first-purchase free gift should be included with fulfilment.';
