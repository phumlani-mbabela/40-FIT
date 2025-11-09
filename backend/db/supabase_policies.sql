
-- Enable RLS
alter table users enable row level security;
alter table accounts enable row level security;
alter table user_accounts enable row level security;
alter table user_subscriptions enable row level security;
alter table invoices enable row level security;
alter table programs enable row level security;
alter table program_subscriptions enable row level security;
alter table guest_passes enable row level security;

-- Expect JWT has: tenant_id, email, roles (array)
-- Helpers
create or replace function auth_email() returns text language sql stable as $$
  select coalesce(current_setting('request.jwt.claims', true)::json->>'email','')
$$;

create or replace function auth_tenant() returns uuid language sql stable as $$
  select coalesce((current_setting('request.jwt.claims', true)::json->>'tenant_id')::uuid, '00000000-0000-0000-0000-000000000001'::uuid)
$$;

create or replace function has_role(r text) returns boolean language sql stable as $$
  select exists (select 1 from json_array_elements_text(coalesce(current_setting('request.jwt.claims', true)::json->'roles','[]'::json)) x where x.value = r)
$$;

-- Policies: tenant isolation + self access
create policy users_tenant_isolation on users using (tenant_id = auth_tenant());
create policy users_self_select on users for select using (email = auth_email() or has_role('Admin') or has_role('TenantAdmin'));
create policy users_self_update on users for update using (email = auth_email() or has_role('Admin') or has_role('TenantAdmin'));

create policy accounts_tenant_isolation on accounts using (tenant_id = auth_tenant());
create policy user_accounts_tenant_isolation on user_accounts using (
  exists(select 1 from accounts a where a.id = user_accounts.account_id and a.tenant_id = auth_tenant())
);

create policy user_subs_tenant_isolation on user_subscriptions using (tenant_id = auth_tenant());
create policy invoices_tenant_isolation on invoices using (tenant_id = auth_tenant());
create policy programs_tenant_isolation on programs using (tenant_id = auth_tenant());
create policy program_subs_tenant_isolation on program_subscriptions using (tenant_id = auth_tenant());
create policy guest_passes_tenant_isolation on guest_passes using (tenant_id = auth_tenant());
