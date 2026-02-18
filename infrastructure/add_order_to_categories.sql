-- Migration to add 'order' column to categories table
-- Run this in your Supabase SQL Editor

ALTER TABLE categories ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Optional: Set some initial orders if you want
-- UPDATE categories SET "order" = 1 WHERE slug = 'blue-sapphire';
-- UPDATE categories SET "order" = 100 WHERE slug = 'fine-gems';
