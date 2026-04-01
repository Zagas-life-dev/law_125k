begin;

create table if not exists public.student_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  user_id uuid not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_push_subscriptions_student_id
  on public.student_push_subscriptions(student_id);

create index if not exists idx_student_push_subscriptions_user_id
  on public.student_push_subscriptions(user_id);

drop trigger if exists trg_student_push_subscriptions_updated_at on public.student_push_subscriptions;
create trigger trg_student_push_subscriptions_updated_at
before update on public.student_push_subscriptions
for each row execute function public.set_updated_at();

create table if not exists public.payment_reminder_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  reminder_key text not null,
  due_date date not null,
  outstanding_balance numeric(12, 2) not null default 0,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint payment_reminder_logs_outstanding_non_negative check (outstanding_balance >= 0),
  constraint payment_reminder_logs_student_key_unique unique (student_id, reminder_key)
);

create index if not exists idx_payment_reminder_logs_student_id
  on public.payment_reminder_logs(student_id);

create index if not exists idx_payment_reminder_logs_sent_at
  on public.payment_reminder_logs(sent_at desc);

alter table public.student_push_subscriptions enable row level security;
alter table public.payment_reminder_logs enable row level security;

drop policy if exists student_push_subscriptions_admin_all on public.student_push_subscriptions;
create policy student_push_subscriptions_admin_all
on public.student_push_subscriptions
for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists student_push_subscriptions_self_select on public.student_push_subscriptions;
create policy student_push_subscriptions_self_select
on public.student_push_subscriptions
for select
using (user_id = auth.uid());

drop policy if exists student_push_subscriptions_self_insert on public.student_push_subscriptions;
create policy student_push_subscriptions_self_insert
on public.student_push_subscriptions
for insert
with check (user_id = auth.uid());

drop policy if exists student_push_subscriptions_self_update on public.student_push_subscriptions;
create policy student_push_subscriptions_self_update
on public.student_push_subscriptions
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists student_push_subscriptions_self_delete on public.student_push_subscriptions;
create policy student_push_subscriptions_self_delete
on public.student_push_subscriptions
for delete
using (user_id = auth.uid());

drop policy if exists payment_reminder_logs_admin_all on public.payment_reminder_logs;
create policy payment_reminder_logs_admin_all
on public.payment_reminder_logs
for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists payment_reminder_logs_self_select on public.payment_reminder_logs;
create policy payment_reminder_logs_self_select
on public.payment_reminder_logs
for select
using (
  exists (
    select 1
    from public.students s
    where s.id = payment_reminder_logs.student_id
      and s.user_id = auth.uid()
  )
);

commit;
