-- Clser app core schema (Phase 4/5 bootstrap)
-- Execute in Supabase SQL Editor (project public schema)

create extension if not exists pgcrypto;

create table if not exists public.accounts (
  internal_user_id text primary key,
  email text not null,
  phone text not null,
  email_verified boolean not null default false,
  phone_verified boolean not null default false,
  username text not null,
  nickname text not null,
  profile_image_url text not null default '',
  birth_date text not null default '',
  city text not null default '',
  gender text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists accounts_email_unique_idx on public.accounts (lower(email));
create unique index if not exists accounts_phone_unique_idx on public.accounts (phone);
create unique index if not exists accounts_username_unique_idx on public.accounts (lower(username));

create table if not exists public.artist_memberships (
  internal_user_id text not null references public.accounts(internal_user_id) on delete cascade,
  artist_id text not null,
  joined_at timestamptz not null default now(),
  status text not null default 'active',
  primary key (internal_user_id, artist_id),
  constraint artist_memberships_status_check check (status in ('active'))
);

create table if not exists public.fan_activity_events (
  mutation_id text primary key,
  operation text not null,
  artist_id text,
  payload jsonb not null default '{}'::jsonb,
  mutation_created_at timestamptz not null default now(),
  mutation_attempts integer not null default 0,
  synced_at timestamptz not null default now(),
  created_by_email text not null default lower(auth.jwt() ->> 'email')
);

alter table public.accounts enable row level security;
alter table public.artist_memberships enable row level security;
alter table public.fan_activity_events enable row level security;

drop policy if exists accounts_select_own on public.accounts;
create policy accounts_select_own
on public.accounts
for select
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists accounts_insert_own on public.accounts;
create policy accounts_insert_own
on public.accounts
for insert
to authenticated
with check (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists accounts_update_own on public.accounts;
create policy accounts_update_own
on public.accounts
for update
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'))
with check (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists memberships_select_own on public.artist_memberships;
create policy memberships_select_own
on public.artist_memberships
for select
to authenticated
using (
  exists (
    select 1
    from public.accounts a
    where a.internal_user_id = artist_memberships.internal_user_id
      and lower(a.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists memberships_insert_own on public.artist_memberships;
create policy memberships_insert_own
on public.artist_memberships
for insert
to authenticated
with check (
  exists (
    select 1
    from public.accounts a
    where a.internal_user_id = artist_memberships.internal_user_id
      and lower(a.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists memberships_update_own on public.artist_memberships;
create policy memberships_update_own
on public.artist_memberships
for update
to authenticated
using (
  exists (
    select 1
    from public.accounts a
    where a.internal_user_id = artist_memberships.internal_user_id
      and lower(a.email) = lower(auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1
    from public.accounts a
    where a.internal_user_id = artist_memberships.internal_user_id
      and lower(a.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists fan_activity_events_select_own on public.fan_activity_events;
create policy fan_activity_events_select_own
on public.fan_activity_events
for select
to authenticated
using (created_by_email = lower(auth.jwt() ->> 'email'));

drop policy if exists fan_activity_events_insert_own on public.fan_activity_events;
create policy fan_activity_events_insert_own
on public.fan_activity_events
for insert
to authenticated
with check (created_by_email = lower(auth.jwt() ->> 'email'));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_accounts_set_updated_at on public.accounts;
create trigger trg_accounts_set_updated_at
before update on public.accounts
for each row
execute function public.set_updated_at();
