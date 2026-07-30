create extension if not exists pgcrypto;

create table if not exists public.admin_users (
    id uuid primary key default gen_random_uuid(),
    username text not null unique,
    display_name text not null,
    password_hash text not null,
    password_salt text not null,
    role text not null default 'viewer'
        check (role in ('owner', 'admin', 'viewer')),
    active boolean not null default true,
    last_login_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists admin_users_active_idx
    on public.admin_users (active);

alter table public.admin_users enable row level security;

-- No public policies are intentionally created. The Vercel server accesses
-- this table through the Supabase service-role key, which bypasses RLS.
-- Never expose SUPABASE_SERVICE_ROLE_KEY to browser-side JavaScript.
