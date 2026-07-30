create extension if not exists pgcrypto;

create table if not exists public.admin_users (
    id uuid primary key default gen_random_uuid(),
    username text not null unique,
    display_name text not null,
    password_hash text not null,
    role text not null default 'viewer'
        check (role in ('owner', 'admin', 'viewer')),
    active boolean not null default true,
    last_login_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Migrate from the earlier application-side scrypt schema when present.
alter table public.admin_users
    drop column if exists password_salt;

create index if not exists admin_users_active_idx
    on public.admin_users (active);

alter table public.admin_users enable row level security;

-- Verifies a password inside PostgreSQL and returns only safe account fields.
create or replace function public.authenticate_admin(
    p_username text,
    p_password text
)
returns table (
    id uuid,
    username text,
    display_name text,
    role text,
    active boolean
)
language sql
security definer
set search_path = public, extensions
as $$
    update public.admin_users
       set last_login_at = now(),
           updated_at = now()
     where lower(admin_users.username) = lower(trim(p_username))
       and admin_users.active = true
       and admin_users.password_hash = crypt(p_password, admin_users.password_hash)
    returning admin_users.id,
              admin_users.username,
              admin_users.display_name,
              admin_users.role,
              admin_users.active;
$$;

-- Creates users while hashing passwords in PostgreSQL.
create or replace function public.create_admin_user(
    p_username text,
    p_display_name text,
    p_password text,
    p_role text default 'viewer'
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    new_id uuid;
begin
    if length(trim(coalesce(p_username, ''))) < 3 then
        raise exception 'Username must be at least 3 characters';
    end if;

    if length(coalesce(p_password, '')) < 12 then
        raise exception 'Password must be at least 12 characters';
    end if;

    if p_role not in ('owner', 'admin', 'viewer') then
        raise exception 'Invalid role';
    end if;

    insert into public.admin_users (
        username,
        display_name,
        password_hash,
        role,
        active
    )
    values (
        lower(trim(p_username)),
        coalesce(nullif(trim(p_display_name), ''), lower(trim(p_username))),
        crypt(p_password, gen_salt('bf', 12)),
        p_role,
        true
    )
    returning id into new_id;

    return new_id;
end;
$$;

revoke all on function public.authenticate_admin(text, text) from public, anon, authenticated;
revoke all on function public.create_admin_user(text, text, text, text) from public, anon, authenticated;
grant execute on function public.authenticate_admin(text, text) to service_role;
grant execute on function public.create_admin_user(text, text, text, text) to service_role;

-- The Vercel server uses SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
-- Never expose SUPABASE_SERVICE_ROLE_KEY to browser-side JavaScript.
