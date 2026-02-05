-- Create popularity table to track clicks
create table if not exists popularity (
    id uuid default gen_random_uuid() primary key,
    item_id text not null,
    item_type text not null check (item_type in ('product', 'category')), -- 'product' or 'category'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add index for faster querying/aggregation
create index if not exists popularity_item_id_idx on popularity(item_id);
create index if not exists popularity_item_type_idx on popularity(item_type);


-- Allow admin select (assuming admin has specific role or using service role, but for now enabling public read might be needed if public client needs it, though usually only admin needs to read stats. Restricting to authenticated users or just service role is better. For now allow public read for simplicity if needed, or just insert)
-- Actually, the Collections page doesn't need to read it, only write. Admin needs to read.
-- We will rely on service role or admin authenticated read.
