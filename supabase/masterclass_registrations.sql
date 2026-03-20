-- LAW Masterclass registrations table
-- Run this in Supabase SQL editor.

create table if not exists public.masterclass_registrations (
  id text primary key,
  location text not null check (location in ('Abuja', 'Lagos')),

  -- Personal information
  full_name text not null,
  age integer not null check (age >= 10 and age <= 100),
  date_of_birth date not null,
  gender text not null,
  phone text not null,
  email text not null,
  city_state text not null,

  -- Modeling profile
  height_value text not null,
  height_unit text not null,
  weight_value text not null,
  weight_unit text not null,
  bust_chest_value text not null,
  bust_chest_unit text not null,
  waist_value text not null,
  waist_unit text not null,
  hips_value text not null,
  hips_unit text not null,
  hips_converted text,
  shoe_size text not null,

  -- Experience
  has_modeling_experience text not null,
  experience_types text,
  prior_training text,

  -- Availability
  full_session_availability text not null,

  -- Motivation & goals
  motivation text not null,
  goals text not null,
  expected_gain text not null,

  -- Socials
  instagram_handle text,
  tiktok_or_other text,

  -- Consent
  consent_photo_video text not null,
  referral_source text not null,

  -- Cloudinary media URLs
  headshot_url text not null,
  full_body_url text not null,
  walk_video_url text,

  created_at timestamptz not null default now()
);

create index if not exists idx_masterclass_registrations_created_at
  on public.masterclass_registrations (created_at desc);

create index if not exists idx_masterclass_registrations_location
  on public.masterclass_registrations (location);

alter table public.masterclass_registrations enable row level security;
