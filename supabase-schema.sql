create extension if not exists pgcrypto;

create table if not exists public.website_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  character_name text not null,
  state_id text not null,
  discord_username text not null,
  fivem_server text not null,
  business_name text not null,
  service_type text not null,
  requested_slug text,
  custom_domain text,
  existing_website text,
  feature_package text,
  project_details text not null,
  status text not null default 'New' check (status in ('New','Contacted','Quoted','In Progress','Completed','Declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists website_requests_created_at_idx
  on public.website_requests (created_at desc);

create index if not exists website_requests_status_idx
  on public.website_requests (status);

alter table public.website_requests enable row level security;

-- No public policies are required. The Vercel backend uses the Supabase
-- service-role key and all browser requests go through the server API.
