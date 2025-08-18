
-- 1) Create leads table (owned per user)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(), -- owner (defaults to current authenticated user)
  name text,
  email text,
  phone text,
  preferred_contact text,
  tags text[] not null default '{}',
  source text not null default 'warm_manual',
  created_at timestamptz not null default now(),
  -- E.164 phone format: +[country][number], up to 15 digits
  constraint leads_phone_format check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$')
);

-- Helpful indexes
create index if not exists leads_user_id_idx on public.leads (user_id);
create index if not exists leads_email_idx on public.leads (email);

-- 2) Create lead_outreach_events table (child of leads)
create table if not exists public.lead_outreach_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  channel text not null default 'sms',
  direction text not null default 'outbound',
  version_sent text,
  campaign_name text not null default 'warm_manual',
  date_sent timestamptz not null default now(),
  content text,
  replied boolean not null default false,
  booked boolean not null default false,
  referrals integer not null default 0,
  clicks integer not null default 0,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists lead_outreach_events_lead_id_idx on public.lead_outreach_events (lead_id);
create index if not exists lead_outreach_events_date_idx on public.lead_outreach_events (date_sent);

-- 3) Enable Row Level Security (RLS)
alter table public.leads enable row level security;
alter table public.lead_outreach_events enable row level security;

-- 4) RLS policies for leads: authenticated users can manage only their rows
drop policy if exists "leads_select_own" on public.leads;
drop policy if exists "leads_insert_own" on public.leads;
drop policy if exists "leads_update_own" on public.leads;
drop policy if exists "leads_delete_own" on public.leads;

create policy "leads_select_own"
on public.leads
for select
to authenticated
using (user_id = auth.uid());

create policy "leads_insert_own"
on public.leads
for insert
to authenticated
with check (user_id = auth.uid());

create policy "leads_update_own"
on public.leads
for update
to authenticated
using (user_id = auth.uid());

create policy "leads_delete_own"
on public.leads
for delete
to authenticated
using (user_id = auth.uid());

-- 5) RLS policies for lead_outreach_events: access allowed only for events tied to leads owned by the user
drop policy if exists "events_select_by_lead_owner" on public.lead_outreach_events;
drop policy if exists "events_insert_by_lead_owner" on public.lead_outreach_events;
drop policy if exists "events_update_by_lead_owner" on public.lead_outreach_events;
drop policy if exists "events_delete_by_lead_owner" on public.lead_outreach_events;

create policy "events_select_by_lead_owner"
on public.lead_outreach_events
for select
to authenticated
using (
  lead_id in (select id from public.leads where user_id = auth.uid())
);

create policy "events_insert_by_lead_owner"
on public.lead_outreach_events
for insert
to authenticated
with check (
  lead_id in (select id from public.leads where user_id = auth.uid())
);

create policy "events_update_by_lead_owner"
on public.lead_outreach_events
for update
to authenticated
using (
  lead_id in (select id from public.leads where user_id = auth.uid())
);

create policy "events_delete_by_lead_owner"
on public.lead_outreach_events
for delete
to authenticated
using (
  lead_id in (select id from public.leads where user_id = auth.uid())
);
