
-- Tenants
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- Users (link to Supabase auth via email)
create table if not exists users (
  email text primary key,
  name text,
  nickname text,
  dob timestamp with time zone,
  created_time timestamp with time zone default now(),
  lastlogon_time timestamp with time zone,
  status text check (status in ('active','inactive','confirmed')) default 'active',
  type text check (type in ('Athlete','Coach','TenantAdmin','Admin')) default 'Athlete',
  profile_pic text,
  address_id bigint,
  user_rating smallint check (user_rating between 0 and 9) default 0,
  tenant_id uuid not null references tenants(id) on delete cascade default '00000000-0000-0000-0000-000000000001'
);

-- Addresses
create table if not exists user_addresses (
  id bigserial primary key,
  address text not null
);

-- Accounts / Families / Corporate
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  need_pt boolean default false,
  tenant_id uuid not null references tenants(id) on delete cascade
);

create table if not exists user_accounts (
  user_email text references users(email) on delete cascade,
  account_id uuid references accounts(id) on delete cascade,
  user_member_type text check (user_member_type in ('Main','Spouse','Child','Brother','Sister')) default 'Main',
  primary key (user_email, account_id)
);

-- Subscription Types
create table if not exists subscription_types (
  code text primary key, -- Free, Premium, Elapsed, Trial, GuestPass
  description text
);

-- User Subscriptions
create table if not exists user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_email text not null references users(email) on delete cascade,
  type_code text not null references subscription_types(code),
  member_type text check (member_type in ('Main','Spouse','Child','Brother','Sister')) default 'Main',
  status text check (status in ('active','paused','canceled','expired','trial','guest')) default 'active',
  created_time timestamp with time zone default now(),
  updated_time timestamp with time zone default now(),
  tenant_id uuid not null references tenants(id) on delete cascade
);

-- Guest Passes (1-day)
create table if not exists guest_passes (
  id uuid primary key default gen_random_uuid(),
  issued_by text not null references users(email) on delete cascade,
  issued_to_email text,
  subscription_id uuid not null references user_subscriptions(id) on delete cascade,
  expires_at timestamp with time zone not null,
  used_at timestamp with time zone,
  tenant_id uuid not null references tenants(id) on delete cascade
);

-- Programs & Assets
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  trainer_email text not null references users(email) on delete cascade,
  title text not null,
  description text,
  base_price_cents integer not null default 0,
  avg_rating numeric(3,2) default 0,
  rating_count integer default 0,
  tenant_id uuid not null references tenants(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists program_assets (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  kind text check (kind in ('video','document')) not null,
  storage_path text not null,
  mime text,
  created_at timestamp with time zone default now()
);

-- Program subscriptions (marketplace purchases)
create table if not exists program_subscriptions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  buyer_email text not null references users(email) on delete cascade,
  status text check (status in ('active','canceled','expired')) default 'active',
  created_at timestamp with time zone default now(),
  tenant_id uuid not null references tenants(id) on delete cascade
);

-- Invoices & Payments
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  user_email text not null references users(email) on delete cascade,
  amount_cents integer not null,
  currency text not null default 'ZAR',
  status text check (status in ('unpaid','paid','void')) default 'unpaid',
  storage_path text, -- path in storage bucket to PDF
  meta jsonb default '{}'::jsonb,
  tenant_id uuid not null references tenants(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  provider text check (provider in ('payfast','paystack')) not null,
  provider_ref text,
  amount_cents integer not null,
  currency text not null default 'ZAR',
  status text check (status in ('pending','succeeded','failed')) default 'pending',
  raw jsonb,
  created_at timestamp with time zone default now(),
  tenant_id uuid not null references tenants(id) on delete cascade
);

-- Webhook events for idempotency/audit
create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_event_id text not null,
  raw jsonb not null,
  processed boolean default false,
  created_at timestamp with time zone default now(),
  unique (provider, external_event_id)
);
