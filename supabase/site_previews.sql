create table if not exists public.site_previews (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    site_url text not null,
    image_data text not null,
    active boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists site_previews_active_sort_idx
    on public.site_previews (active, sort_order, created_at);

alter table public.site_previews enable row level security;

revoke all on table public.site_previews from anon, authenticated;
grant all on table public.site_previews to service_role;

insert into public.site_previews (
    title,
    description,
    site_url,
    image_data,
    active,
    sort_order
)
select
    'Los Santos Property Services',
    'A complete FiveM business site and operations portal built for LSPS.',
    '/lsps',
    'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22675%22 viewBox=%220 0 1200 675%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22%3E%3Cstop stop-color=%22%23102640%22/%3E%3Cstop offset=%221%22 stop-color=%22%2316385b%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%221200%22 height=%22675%22 fill=%22url(%23g)%22/%3E%3Ctext x=%22600%22 y=%22310%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22Arial,sans-serif%22 font-size=%2290%22 font-weight=%22700%22%3ELSPS%3C/text%3E%3Ctext x=%22600%22 y=%22390%22 text-anchor=%22middle%22 fill=%22%23aebfd3%22 font-family=%22Arial,sans-serif%22 font-size=%2236%22%3ELos Santos Property Services%3C/text%3E%3C/svg%3E',
    true,
    0
where not exists (
    select 1 from public.site_previews where site_url = '/lsps'
);

notify pgrst, 'reload schema';
