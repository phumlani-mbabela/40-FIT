
do $$ begin
  alter table guest_passes add column if not exists first_activated_at timestamptz;
exception when duplicate_column then null; end $$;

do $$ begin
  alter table guest_passes add column if not exists status text check (status in ('pending','active','expired')) default 'pending';
exception when duplicate_column then null; end $$;

update guest_passes
set status = case
  when expires_at is not null and expires_at > now() then 'active'
  when expires_at is not null and expires_at <= now() then 'expired'
  else 'pending'
end
where status is null;
