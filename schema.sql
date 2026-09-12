-- Hiba Sofa Works — database schema
-- Run this once in Supabase: Project -> SQL Editor -> New query -> paste -> Run

-- 1. PRODUCTS TABLE
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,              -- e.g. "ivory-linen-3seater" (used in the URL)
  name text not null,                     -- e.g. "Ivory Linen 3-Seater"
  category text not null,                 -- "3-Seater" | "Corner Sofa" | "3+1+1 Set" | "3+2 Set" | "Lounge Sofa"
  seating int default 0,
  fabric text,
  price_from numeric,                     -- e.g. 32000
  tagline text,                           -- short line shown on the catalog card
  description text,
  dimensions text,                        -- e.g. "72 in W x 34 in D x 32 in H"
  features text[] default '{}',           -- bullet list shown on the product page
  images text[] default '{}',             -- photo URLs; first one is the main catalog image
  in_stock boolean default true,          -- unticking this hides it from the public site
  sort_order int default 0,               -- controls display order on the catalog page
  created_at timestamptz default now()
);

-- 2. ORDERS TABLE (used once checkout is added)
create table orders (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text,
  razorpay_payment_id text,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  pincode text not null,
  items jsonb not null,                   -- snapshot of cart items at checkout
  subtotal numeric not null,
  status text default 'pending',          -- pending -> paid -> shipped -> delivered
  created_at timestamptz default now()
);

-- 3. ROW-LEVEL SECURITY (keeps your data safe)
alter table products enable row level security;
alter table orders enable row level security;

-- Anyone can VIEW products (needed for the public catalog)
create policy "public can view products"
  on products for select
  using (true);

-- Only a logged-in admin (you) can add/edit/delete products
create policy "admin can manage products"
  on products for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Orders are only readable/writable by the server (using the service role key),
-- never directly by public visitors — this keeps customer data and payment
-- status safe from tampering. No public policy is created for orders on purpose.

-- 4. STORAGE BUCKET for product photos
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true);

create policy "public can view product photos"
  on storage.objects for select
  using (bucket_id = 'product-photos');

create policy "admin can upload product photos"
  on storage.objects for insert
  with check (bucket_id = 'product-photos' and auth.uid() is not null);

create policy "admin can delete product photos"
  on storage.objects for delete
  using (bucket_id = 'product-photos' and auth.uid() is not null);
