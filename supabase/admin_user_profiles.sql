-- Admin access control table for the Next.js admin dashboard.
-- Create this table and set `is_admin=true` for the users who should manage registrations.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

-- Allow users to read their own profile row
drop policy if exists "User can read own profile" on public.user_profiles;
create policy "User can read own profile"
on public.user_profiles
for select
using (auth.uid() = user_id);

-- Allow users to update only their own profile row
drop policy if exists "User can update own profile" on public.user_profiles;
create policy "User can update own profile"
on public.user_profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Example (run manually after you know the user UUID):
-- update public.user_profiles set is_admin = true where user_id = '<SUPABASE_AUTH_USER_UUID>';

