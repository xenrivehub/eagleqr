INSERT INTO "Allergen" (id, code, label) VALUES
  (gen_random_uuid()::text, 'gluten', 'Glüten'),
  (gen_random_uuid()::text, 'crustaceans', 'Kabuklu deniz ürünleri'),
  (gen_random_uuid()::text, 'eggs', 'Yumurta'),
  (gen_random_uuid()::text, 'fish', 'Balık'),
  (gen_random_uuid()::text, 'peanuts', 'Yer fıstığı'),
  (gen_random_uuid()::text, 'soybeans', 'Soya'),
  (gen_random_uuid()::text, 'milk', 'Süt'),
  (gen_random_uuid()::text, 'nuts', 'Sert kabuklu yemişler'),
  (gen_random_uuid()::text, 'celery', 'Kereviz'),
  (gen_random_uuid()::text, 'mustard', 'Hardal'),
  (gen_random_uuid()::text, 'sesame', 'Susam'),
  (gen_random_uuid()::text, 'sulphites', 'Sülfitler'),
  (gen_random_uuid()::text, 'lupin', 'Acı bakla'),
  (gen_random_uuid()::text, 'molluscs', 'Yumuşakçalar')
ON CONFLICT (code) DO NOTHING;
