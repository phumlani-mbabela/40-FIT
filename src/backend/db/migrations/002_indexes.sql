
create index if not exists idx_users_tenant on users(tenant_id);
create index if not exists idx_accounts_tenant on accounts(tenant_id);
create index if not exists idx_user_subs_user on user_subscriptions(user_email);
create index if not exists idx_user_subs_tenant on user_subscriptions(tenant_id);
create index if not exists idx_invoices_user on invoices(user_email);
create index if not exists idx_invoices_tenant on invoices(tenant_id);
create index if not exists idx_programs_trainer on programs(trainer_email);
create index if not exists idx_programs_tenant on programs(tenant_id);
create index if not exists idx_prog_subs_buyer on program_subscriptions(buyer_email);
