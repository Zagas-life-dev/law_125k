begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

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

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  registration_id text unique,
  reg_number bigint,
  student_id bigint unique,
  status text not null default 'active' check (status in ('active', 'inactive', 'graduated', 'archived')),
  full_name text,
  email text,
  phone text,
  date_of_birth date,
  age int,
  gender text,
  city_state text,
  location_mode text check (location_mode in ('online', 'lagos', 'abuja', 'custom')),
  custom_location_text text,
  height_value text,
  height_unit text,
  weight_value text,
  weight_unit text,
  bust_chest_value text,
  bust_chest_unit text,
  waist_value text,
  waist_unit text,
  hips_value text,
  hips_unit text,
  hips_converted text,
  shoe_size text,
  has_modeling_experience text,
  experience_types text,
  prior_training text,
  full_session_availability text,
  motivation text,
  goals text,
  expected_gain text,
  instagram_handle text,
  tiktok_or_other text,
  tracks text[] not null default '{}',
  plan_type text not null default 'standard' check (plan_type in ('standard', 'custom')),
  custom_plan_name text,
  total_due numeric(12, 2) not null default 0,
  amount_paid numeric(12, 2) not null default 0,
  scholarship_type text not null default 'none' check (scholarship_type in ('none', 'percentage', 'full')),
  scholarship_percent numeric(5, 2) not null default 0,
  scholarship_amount_applied numeric(12, 2) not null default 0,
  outstanding_balance numeric(12, 2) not null default 0,
  due_date date,
  monthly_enabled boolean not null default false,
  monthly_amount numeric(12, 2),
  headshot_url text,
  profile_front_url text,
  profile_left_url text,
  profile_right_url text,
  profile_back_url text,
  full_body_front_url text,
  full_body_left_url text,
  full_body_right_url text,
  full_body_back_url text,
  walk_video_1_url text,
  walk_video_2_url text,
  admin_notes text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint students_money_non_negative check (
    total_due >= 0
    and amount_paid >= 0
    and scholarship_percent >= 0
    and scholarship_percent <= 100
  )
);

create index if not exists idx_students_user_id on public.students(user_id);
create index if not exists idx_students_registration_id on public.students(registration_id);
create index if not exists idx_students_status on public.students(status);
create index if not exists idx_students_created_at on public.students(created_at desc);
create index if not exists idx_students_tracks_gin on public.students using gin(tracks);

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
    exit when not exists (select 1 from public.students s where s.student_id = candidate);
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

drop trigger if exists trg_students_updated_at on public.students;
create trigger trg_students_updated_at
before update on public.students
for each row execute function public.set_updated_at();

drop trigger if exists trg_students_assign_student_id on public.students;
create trigger trg_students_assign_student_id
before insert on public.students
for each row execute function public.assign_student_id_if_missing();

alter table public.students enable row level security;

drop policy if exists students_admin_all on public.students;
create policy students_admin_all
on public.students
for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists students_self_select on public.students;
create policy students_self_select
on public.students
for select
using (user_id = auth.uid());

drop policy if exists students_self_insert on public.students;
create policy students_self_insert
on public.students
for insert
with check (user_id = auth.uid());

drop policy if exists students_self_update on public.students;
create policy students_self_update
on public.students
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists students_self_delete on public.students;

commit;
 