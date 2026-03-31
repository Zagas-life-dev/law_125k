-- Student management schema with auth user linkage.
-- Safe/idempotent migration where possible.

create table if not exists public.student_profiles (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  student_id bigint unique,
  user_id uuid unique,
  status text not null default 'active',
  location_mode text check (location_mode in ('online', 'lagos', 'abuja', 'custom')),
  custom_location_text text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_media (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  headshot_url text,
  profile_front_url text,
  profile_left_url text,
  profile_right_url text,
  profile_back_url text,
  full_body_front_url text,
  full_body_left_url text,
  full_body_right_url text,
  full_body_back_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_videos (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  walk_video_1_url text,
  walk_video_2_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_enrollments (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  tracks text[] not null default '{}',
  track text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_billing (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  plan_type text not null default 'standard' check (plan_type in ('standard', 'custom')),
  custom_plan_name text,
  total_due numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  due_date date,
  monthly_enabled boolean not null default false,
  monthly_amount numeric(12,2),
  scholarship_type text not null default 'none' check (scholarship_type in ('none', 'percentage', 'full')),
  scholarship_percent numeric(5,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_profiles_status on public.student_profiles(status);
create index if not exists idx_student_profiles_user_id on public.student_profiles(user_id);
create index if not exists idx_student_profiles_student_id on public.student_profiles(student_id);
create index if not exists idx_student_billing_due_date on public.student_billing(due_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_student_profiles_updated_at on public.student_profiles;
create trigger trg_student_profiles_updated_at
before update on public.student_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_media_updated_at on public.student_media;
create trigger trg_student_media_updated_at
before update on public.student_media
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_videos_updated_at on public.student_videos;
create trigger trg_student_videos_updated_at
before update on public.student_videos
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_enrollments_updated_at on public.student_enrollments;
create trigger trg_student_enrollments_updated_at
before update on public.student_enrollments
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_billing_updated_at on public.student_billing;
create trigger trg_student_billing_updated_at
before update on public.student_billing
for each row execute function public.set_updated_at();

create or replace function public.generate_unique_student_id_8digit()
returns bigint
language plpgsql
as $$
declare
  candidate bigint;
  tries int := 0;
begin
  loop
    candidate := floor(10000000 + random() * 90000000)::bigint;
    exit when not exists (select 1 from public.student_profiles where student_id = candidate);
    tries := tries + 1;
    if tries > 25 then
      raise exception 'Could not generate unique 8-digit student_id after % attempts', tries;
    end if;
  end loop;
  return candidate;
end;
$$;

create or replace function public.assign_student_id_if_missing()
returns trigger
language plpgsql
as $$
begin
  if new.student_id is null then
    new.student_id := public.generate_unique_student_id_8digit();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_student_id on public.student_profiles;
create trigger trg_assign_student_id
before insert on public.student_profiles
for each row execute function public.assign_student_id_if_missing();

-- Backfill any existing student profile rows.
update public.student_profiles
set student_id = public.generate_unique_student_id_8digit()
where student_id is null;

-- Remediation helper for legacy/unlinked records:
-- link profile rows to auth users by verified matching email.
create or replace function public.link_student_profiles_by_email()
returns integer
language plpgsql
security definer
as $$
declare
  linked_count integer := 0;
begin
  update public.student_profiles sp
  set user_id = au.id
  from public.masterclass_registrations mr
  join auth.users au on lower(coalesce(au.email, '')) = lower(coalesce(mr.email, ''))
  where sp.registration_id = mr.id
    and sp.user_id is null;

  get diagnostics linked_count = row_count;
  return linked_count;
end;
$$;

-- Optional: enable RLS (policies can be added by your auth model).
alter table public.student_profiles enable row level security;
alter table public.student_media enable row level security;
alter table public.student_videos enable row level security;
alter table public.student_enrollments enable row level security;
alter table public.student_billing enable row level security;

-- ==========================================================
-- RLS: admin full access + student self access (by user_id)
-- ==========================================================

-- 1) Reusable admin helper.
create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles up
    where up.user_id = auth.uid()
      and up.is_admin = true
  );
$$;

-- 2) Ensure RLS is enabled on all protected tables.
alter table public.masterclass_registrations enable row level security;
alter table public.student_profiles enable row level security;
alter table public.student_media enable row level security;
alter table public.student_videos enable row level security;
alter table public.student_enrollments enable row level security;
alter table public.student_billing enable row level security;
alter table public.student_onboarding enable row level security;

-- 3) Admin full-access policies.
drop policy if exists admin_all_masterclass_registrations on public.masterclass_registrations;
create policy admin_all_masterclass_registrations
on public.masterclass_registrations
for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists admin_all_student_profiles on public.student_profiles;
create policy admin_all_student_profiles
on public.student_profiles
for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists admin_all_student_media on public.student_media;
create policy admin_all_student_media
on public.student_media
for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists admin_all_student_videos on public.student_videos;
create policy admin_all_student_videos
on public.student_videos
for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists admin_all_student_enrollments on public.student_enrollments;
create policy admin_all_student_enrollments
on public.student_enrollments
for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists admin_all_student_billing on public.student_billing;
create policy admin_all_student_billing
on public.student_billing
for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists admin_all_student_onboarding on public.student_onboarding;
create policy admin_all_student_onboarding
on public.student_onboarding
for all
using (public.is_admin_user())
with check (public.is_admin_user());

-- 4) Student self-access policies.
-- Onboarding is directly keyed by auth user_id.
drop policy if exists student_self_onboarding_select on public.student_onboarding;
create policy student_self_onboarding_select
on public.student_onboarding
for select
using (user_id = auth.uid());

drop policy if exists student_self_onboarding_upsert on public.student_onboarding;
create policy student_self_onboarding_upsert
on public.student_onboarding
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Profiles are linked by user_id.
drop policy if exists student_self_profiles_all on public.student_profiles;
create policy student_self_profiles_all
on public.student_profiles
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Related tables are linked via registration_id -> student_profiles(user_id).
drop policy if exists student_self_media_all on public.student_media;
create policy student_self_media_all
on public.student_media
for all
using (
  exists (
    select 1
    from public.student_profiles sp
    where sp.registration_id = student_media.registration_id
      and sp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.student_profiles sp
    where sp.registration_id = student_media.registration_id
      and sp.user_id = auth.uid()
  )
);

drop policy if exists student_self_videos_all on public.student_videos;
create policy student_self_videos_all
on public.student_videos
for all
using (
  exists (
    select 1
    from public.student_profiles sp
    where sp.registration_id = student_videos.registration_id
      and sp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.student_profiles sp
    where sp.registration_id = student_videos.registration_id
      and sp.user_id = auth.uid()
  )
);

drop policy if exists student_self_enrollments_all on public.student_enrollments;
create policy student_self_enrollments_all
on public.student_enrollments
for all
using (
  exists (
    select 1
    from public.student_profiles sp
    where sp.registration_id = student_enrollments.registration_id
      and sp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.student_profiles sp
    where sp.registration_id = student_enrollments.registration_id
      and sp.user_id = auth.uid()
  )
);

drop policy if exists student_self_billing_all on public.student_billing;
create policy student_self_billing_all
on public.student_billing
for all
using (
  exists (
    select 1
    from public.student_profiles sp
    where sp.registration_id = student_billing.registration_id
      and sp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.student_profiles sp
    where sp.registration_id = student_billing.registration_id
      and sp.user_id = auth.uid()
  )
);

drop policy if exists student_self_masterclass_select on public.masterclass_registrations;
create policy student_self_masterclass_select
on public.masterclass_registrations
for select
using (
  exists (
    select 1
    from public.student_profiles sp
    where sp.registration_id = masterclass_registrations.id
      and sp.user_id = auth.uid()
  )
);

-- first-time onboarding table linked strictly to auth user.
create table if not exists public.student_onboarding (
  user_id uuid primary key,
  full_name text,
  phone text,
  gender text,
  city_state text,
  preferred_location text,
  selected_tracks text[] not null default '{}',
  scholarship_type text not null default 'none' check (scholarship_type in ('none', 'percentage', 'full')),
  scholarship_percent numeric(5,2) not null default 0,
  monthly_enabled boolean not null default false,
  monthly_amount numeric(12,2),
  due_date date,
  total_due numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  scholarship_amount_applied numeric(12,2) not null default 0,
  outstanding_balance numeric(12,2) not null default 0,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_onboarding_completed on public.student_onboarding(completed);

drop trigger if exists trg_student_onboarding_updated_at on public.student_onboarding;
create trigger trg_student_onboarding_updated_at
before update on public.student_onboarding
for each row execute function public.set_updated_at();

alter table public.student_onboarding enable row level security;
-- Student management tables and 8-digit student_id.
-- Safe to run multiple times.

create table if not exists public.student_profiles (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  student_id bigint unique,
  status text default 'active',
  location_mode text check (location_mode in ('online','lagos','abuja','custom')),
  custom_location_text text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_media (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  headshot_url text,
  profile_front_url text,
  profile_left_url text,
  profile_right_url text,
  profile_back_url text,
  full_body_front_url text,
  full_body_left_url text,
  full_body_right_url text,
  full_body_back_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_videos (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  walk_video_1_url text,
  walk_video_2_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_enrollments (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  tracks text[] not null default '{}',
  track text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_billing (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  plan_type text not null default 'standard' check (plan_type in ('standard','custom')),
  custom_plan_name text,
  total_due numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  due_date date,
  monthly_enabled boolean not null default false,
  monthly_amount numeric(12,2),
  scholarship_type text not null default 'none' check (scholarship_type in ('none','percentage','full')),
  scholarship_percent numeric(5,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_profiles_status on public.student_profiles(status);
create index if not exists idx_student_billing_due_date on public.student_billing(due_date);

-- 8-digit student_id generator (unique, random).
create or replace function public.generate_unique_student_id_8digit()
returns bigint
language plpgsql
as $$
declare
  candidate bigint;
  attempts int := 0;
begin
  loop
    candidate := floor(10000000 + random() * 90000000);
    exit when not exists (select 1 from public.student_profiles where student_id = candidate);
    attempts := attempts + 1;
    if attempts > 15 then
      raise exception 'Failed to generate unique 8-digit student_id';
    end if;
  end loop;
  return candidate;
end;
$$;

create or replace function public.set_student_id_if_missing()
returns trigger
language plpgsql
as $$
begin
  if new.student_id is null then
    new.student_id := public.generate_unique_student_id_8digit();
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_student_profiles_set_student_id on public.student_profiles;
create trigger trg_student_profiles_set_student_id
before insert or update on public.student_profiles
for each row execute function public.set_student_id_if_missing();
-- Student management schema
-- Safe to run multiple times (idempotent where possible).
-- This adds a unique 8-digit student_id on student_profiles (bigint), similar to reg_number behavior.

-- 1) student_profiles
create table if not exists public.student_profiles (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  student_id bigint unique,
  status text not null default 'active',
  location_mode text check (location_mode in ('online', 'lagos', 'abuja', 'custom')),
  custom_location_text text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) student_media
create table if not exists public.student_media (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  headshot_url text,
  profile_front_url text,
  profile_left_url text,
  profile_right_url text,
  profile_back_url text,
  full_body_front_url text,
  full_body_left_url text,
  full_body_right_url text,
  full_body_back_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) student_videos
create table if not exists public.student_videos (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  walk_video_1_url text,
  walk_video_2_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4) student_enrollments
create table if not exists public.student_enrollments (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  tracks text[] not null default '{}',
  track text, -- backward compatibility for single-value writes
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5) student_billing
create table if not exists public.student_billing (
  registration_id text primary key references public.masterclass_registrations(id) on delete cascade,
  plan_type text not null default 'standard' check (plan_type in ('standard', 'custom')),
  custom_plan_name text,
  total_due numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  due_date date,
  monthly_enabled boolean not null default false,
  monthly_amount numeric(12,2),
  scholarship_type text not null default 'none' check (scholarship_type in ('none', 'percentage', 'full')),
  scholarship_percent numeric(5,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_student_profiles_status on public.student_profiles(status);
create index if not exists idx_student_billing_due_date on public.student_billing(due_date);
create index if not exists idx_student_profiles_student_id on public.student_profiles(student_id);

-- Keep timestamps fresh on update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_student_profiles_updated_at on public.student_profiles;
create trigger trg_student_profiles_updated_at
before update on public.student_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_media_updated_at on public.student_media;
create trigger trg_student_media_updated_at
before update on public.student_media
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_videos_updated_at on public.student_videos;
create trigger trg_student_videos_updated_at
before update on public.student_videos
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_enrollments_updated_at on public.student_enrollments;
create trigger trg_student_enrollments_updated_at
before update on public.student_enrollments
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_billing_updated_at on public.student_billing;
create trigger trg_student_billing_updated_at
before update on public.student_billing
for each row execute function public.set_updated_at();

-- Generate unique 8-digit student_id (10000000 - 99999999)
create or replace function public.generate_unique_student_id()
returns bigint
language plpgsql
as $$
declare
  candidate bigint;
  tries int := 0;
begin
  loop
    candidate := floor(10000000 + random() * 90000000)::bigint;
    exit when not exists (
      select 1 from public.student_profiles p where p.student_id = candidate
    );
    tries := tries + 1;
    if tries > 25 then
      raise exception 'Could not generate unique 8-digit student_id after % attempts', tries;
    end if;
  end loop;

  return candidate;
end;
$$;

create or replace function public.assign_student_id()
returns trigger
language plpgsql
as $$
begin
  if new.student_id is null then
    new.student_id := public.generate_unique_student_id();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_student_id on public.student_profiles;
create trigger trg_assign_student_id
before insert on public.student_profiles
for each row execute function public.assign_student_id();

-- Backfill existing rows that do not yet have student_id
update public.student_profiles
set student_id = public.generate_unique_student_id()
where student_id is null;

-- Optional RLS enablement (policies can be added based on your auth model)
alter table public.student_profiles enable row level security;
alter table public.student_media enable row level security;
alter table public.student_videos enable row level security;
alter table public.student_enrollments enable row level security;
alter table public.student_billing enable row level security;
