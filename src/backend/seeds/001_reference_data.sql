INSERT INTO ref_subscription_tiers (code, name) VALUES ('free','Free'), ('premium','Premium') ON CONFLICT (code) DO NOTHING;
INSERT INTO ref_genders (code, name) VALUES ('male','Male'), ('female','Female'), ('other','Other'), ('prefer_not_to_say','Prefer not to say') ON CONFLICT (code) DO NOTHING;
INSERT INTO ref_body_types (code, name) VALUES ('ectomorph','Ectomorph'), ('mesomorph','Mesomorph'), ('endomorph','Endomorph'), ('mixed','Mixed') ON CONFLICT (code) DO NOTHING;
INSERT INTO ref_ranks (code, name) VALUES ('bronze','Bronze'), ('silver','Silver'), ('gold','Gold'), ('platinum','Platinum'), ('diamond','Diamond') ON CONFLICT (code) DO NOTHING;

WITH sa AS (
  INSERT INTO ref_countries (iso2, name) VALUES ('ZA','South Africa')
  ON CONFLICT (iso2) DO UPDATE SET name=EXCLUDED.name
  RETURNING id
)
INSERT INTO ref_provinces (country_id, name)
SELECT id, p FROM sa, (VALUES
('Eastern Cape'),('Free State'),('Gauteng'),('KwaZulu-Natal'),('Limpopo'),
('Mpumalanga'),('Northern Cape'),('North West'),('Western Cape')
) AS t(p)
ON CONFLICT DO NOTHING;

WITH gauteng AS (
  SELECT rp.id FROM ref_provinces rp JOIN ref_countries rc ON rc.id = rp.country_id AND rc.iso2='ZA' WHERE rp.name='Gauteng'
),
wc AS (
  SELECT rp.id FROM ref_provinces rp JOIN ref_countries rc ON rc.id = rp.country_id AND rc.iso2='ZA' WHERE rp.name='Western Cape'
),
kzn AS (
  SELECT rp.id FROM ref_provinces rp JOIN ref_countries rc ON rc.id = rp.country_id AND rc.iso2='ZA' WHERE rp.name='KwaZulu-Natal'
)
INSERT INTO ref_cities (province_id, name) SELECT id, city FROM gauteng, (VALUES ('Johannesburg'),('Pretoria'),('Soweto')) x(city) ON CONFLICT DO NOTHING;
INSERT INTO ref_cities (province_id, name) SELECT id, city FROM wc, (VALUES ('Cape Town'),('Stellenbosch')) x(city) ON CONFLICT DO NOTHING;
INSERT INTO ref_cities (province_id, name) SELECT id, city FROM kzn, (VALUES ('Durban'),('Pietermaritzburg')) x(city) ON CONFLICT DO NOTHING;