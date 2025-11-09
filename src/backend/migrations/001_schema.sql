CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;
DO $$ BEGIN CREATE TYPE plan_status AS ENUM ('active','past_due','canceled','trialing','expired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE access_tier AS ENUM ('free','premium'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE discount_type AS ENUM ('percent','fixed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE question_type AS ENUM ('text','number','single_choice','multi_choice','boolean','date','json'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE member_role AS ENUM ('owner','admin','trainer','member'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS ref_subscription_tiers (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), code TEXT UNIQUE NOT NULL, name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ref_genders (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), code TEXT UNIQUE NOT NULL, name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ref_body_types (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), code TEXT UNIQUE NOT NULL, name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ref_ranks (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), code TEXT UNIQUE NOT NULL, name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ref_countries (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), iso2 CHAR(2) UNIQUE NOT NULL, name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ref_provinces (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), country_id UUID NOT NULL REFERENCES ref_countries(id) ON DELETE CASCADE, name TEXT NOT NULL, UNIQUE(country_id, name));
CREATE TABLE IF NOT EXISTS ref_cities (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), province_id UUID NOT NULL REFERENCES ref_provinces(id) ON DELETE CASCADE, name TEXT NOT NULL, UNIQUE(province_id, name));

CREATE TABLE IF NOT EXISTS tenants (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, is_default BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE UNIQUE INDEX IF NOT EXISTS tenants_one_default_idx ON tenants ((CASE WHEN is_default THEN 1 ELSE NULL END));

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(,
  -- FPF_ADDED
  equipment_owned JSONB NOT NULL DEFAULT '[]'::jsonb,           -- list of items user has at home
preferred_environment TEXT[] NOT NULL DEFAULT ARRAY['home']   -- e.g., 'home','park'
),
  email CITEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  gender_id UUID REFERENCES ref_genders(id),
  body_type_id UUID REFERENCES ref_body_types(id),
  country_id UUID REFERENCES ref_countries(id),
  province_id UUID REFERENCES ref_provinces(id),
  city_id UUID REFERENCES ref_cities(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS tenant_memberships (tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, role member_role NOT NULL DEFAULT 'member', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY (tenant_id, user_id));

CREATE TABLE IF NOT EXISTS personal_trainers (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(,
  -- FPF_ADDED
  virtual_only BOOLEAN NOT NULL DEFAULT TRUE,
booking_link TEXT
), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL, bio TEXT, specialties TEXT[], rate_cents INTEGER, active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS programs (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(,
  -- FPF_ADDED
  goal_tags TEXT[] NOT NULL DEFAULT '{}',     -- e.g., strength, mobility, weight-loss
level TEXT,                                 -- e.g., beginner, intermediate, advanced
estimated_weeks INTEGER                     -- suggested duration
), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT, tier access_tier NOT NULL DEFAULT 'free', price_cents INTEGER, currency TEXT, published BOOLEAN NOT NULL DEFAULT FALSE, created_by UUID REFERENCES users(id) ON DELETE SET NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS programs_tenant_published_idx ON programs (tenant_id, published);

CREATE TABLE IF NOT EXISTS courses (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(,
  -- FPF_ADDED
  goal_tags TEXT[] NOT NULL DEFAULT '{}',
level TEXT
), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, program_id UUID REFERENCES programs(id) ON DELETE SET NULL, title TEXT NOT NULL, summary TEXT, tier access_tier NOT NULL DEFAULT 'free', order_index INTEGER NOT NULL DEFAULT 0, content JSONB NOT NULL DEFAULT '{}'::jsonb, published BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS courses_program_idx ON courses (program_id);
CREATE INDEX IF NOT EXISTS courses_tenant_published_idx ON courses (tenant_id, published);

CREATE TABLE IF NOT EXISTS exercises (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(,
  -- FPF_ADDED
  environment TEXT[] NOT NULL DEFAULT ARRAY['home'],  -- 'home','park'
min_space_sqm NUMERIC(4,1),                         -- recommended floor space
requires_equipment BOOLEAN NOT NULL DEFAULT FALSE,
recommended_equipment TEXT[] NOT NULL DEFAULT '{}'  -- e.g., rings, bands, chair
), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, name TEXT NOT NULL, muscle_group TEXT, equipment TEXT, media JSONB NOT NULL DEFAULT '[]'::jsonb, metadata JSONB NOT NULL DEFAULT '{}'::jsonb);
CREATE TABLE IF NOT EXISTS workouts (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(,
  -- FPF_ADDED
  environment TEXT[] NOT NULL DEFAULT ARRAY['home'],
duration_min INTEGER,
no_gym_required BOOLEAN NOT NULL DEFAULT TRUE
), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT, tier access_tier NOT NULL DEFAULT 'free', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS workout_exercises (workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE, exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE, order_index INTEGER NOT NULL DEFAULT 0, sets INTEGER, reps INTEGER, duration_s INTEGER, PRIMARY KEY (workout_id, exercise_id));

CREATE TABLE IF NOT EXISTS subscriptions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, plan_name TEXT NOT NULL,
  tier_code TEXT REFERENCES ref_subscription_tiers(code), status plan_status NOT NULL, started_at TIMESTAMPTZ NOT NULL DEFAULT now(), renews_at TIMESTAMPTZ, ends_at TIMESTAMPTZ, external_ref TEXT, UNIQUE (tenant_id, user_id));
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions (tenant_id, status);

CREATE TABLE IF NOT EXISTS ranks (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, name TEXT NOT NULL, level INTEGER NOT NULL, threshold INTEGER NOT NULL, UNIQUE (tenant_id, level));
CREATE TABLE IF NOT EXISTS user_points (tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, points INTEGER NOT NULL DEFAULT 0, updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY (tenant_id, user_id));
CREATE TABLE IF NOT EXISTS rewards (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, name TEXT NOT NULL, description TEXT, points_cost INTEGER NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE);
CREATE TABLE IF NOT EXISTS user_rewards (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE, claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE (tenant_id, user_id, reward_id));

CREATE TABLE IF NOT EXISTS food_recipes (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT, ingredients JSONB NOT NULL DEFAULT '[]'::jsonb, steps JSONB NOT NULL DEFAULT '[]'::jsonb, macros JSONB, created_by UUID REFERENCES users(id) ON DELETE SET NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS questionnaires (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS questionnaire_questions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE, order_index INTEGER NOT NULL DEFAULT 0, prompt TEXT NOT NULL, qtype question_type NOT NULL, options JSONB NOT NULL DEFAULT '[]'::jsonb);
CREATE INDEX IF NOT EXISTS qq_questionnaire_idx ON questionnaire_questions (questionnaire_id, order_index);
CREATE TABLE IF NOT EXISTS questionnaire_responses (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE, tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, user_id UUID REFERENCES users(id) ON DELETE SET NULL, submitted_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS questionnaire_answers (response_id UUID NOT NULL REFERENCES questionnaire_responses(id) ON DELETE CASCADE, question_id UUID NOT NULL REFERENCES questionnaire_questions(id) ON DELETE CASCADE, answer JSONB, PRIMARY KEY (response_id, question_id));

CREATE TABLE IF NOT EXISTS vouchers (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, code TEXT NOT NULL, type discount_type NOT NULL, amount NUMERIC(12,2) NOT NULL, currency TEXT, max_redemptions INTEGER, expires_at TIMESTAMPTZ, active BOOLEAN NOT NULL DEFAULT TRUE, UNIQUE (tenant_id, code));
CREATE TABLE IF NOT EXISTS voucher_redemptions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, voucher_id UUID NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL, redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE (tenant_id, voucher_id, user_id));

CREATE SCHEMA IF NOT EXISTS app;
CREATE OR REPLACE FUNCTION app.current_tenant() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid
$$;

INSERT INTO tenants (name, slug, is_default)
SELECT 'Default', 'default', TRUE
WHERE NOT EXISTS (SELECT 1 FROM tenants WHERE is_default = TRUE);
