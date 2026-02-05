-- 1. Create the table
create table if not exists public.seo_metadata (
  path text primary key,
  title text not null,
  description text,
  og_image text,
  updated_at timestamp with time zone default now()
);

-- 2. Enable RLS
alter table public.seo_metadata enable row level security;

-- 3. Create policies (Adjust 'authenticated' if you have specific roles)
drop policy if exists "Allow public read access" on public.seo_metadata;
create policy "Allow public read access"
  on public.seo_metadata for select
  using (true);

drop policy if exists "Allow authenticated insert/update" on public.seo_metadata;
create policy "Allow authenticated insert/update"
  on public.seo_metadata for all
  using (auth.role() = 'authenticated');

-- 4. Seed Initial Data
insert into public.seo_metadata (path, title, description, og_image)
values 
  (
    '/', 
    'Serendia Gems | Authentic Sri Lankan Sapphires & Gemstones', 
    'Discover ethically sourced, GIA-certified sapphires and precious gemstones directly from Ratnapura, Sri Lanka. Shop our exclusive collection of natural stones.', 
    '/logo.png'
  ),
  (
    '/collections', 
    'Gemstone Collections | Buy Natural Sapphires Online', 
    'Explore our curated collection of Blue Sapphires, Padparadscha, Rubies, and more. All stones are ethically mined and expertly cut.', 
    '/neckless.jpg'
  ),
  (
    '/about', 
    'Our Philosophy | Serendia Gems', 
    'Learn about our journey from the mines of Sri Lanka to the world. We are committed to ethical sourcing, transparency, and preserving the art of gem cutting.', 
    '/philosophy-section.jpeg'
  ),
  (
    '/contact', 
    'Contact Us | Serendia Gems', 
    'Get in touch with our gemologists for custom inquiries, appointments, or support. We offer worldwide shipping and personalized consultation.', 
    '/logo.png'
  )
on conflict (path) do update 
set 
  title = excluded.title, 
  description = excluded.description, 
  og_image = excluded.og_image;
