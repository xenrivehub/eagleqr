-- Arayüz metni çevirileri (admin panelinden girilir)
CREATE TABLE "UiTranslation" (
  "lang" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  CONSTRAINT "UiTranslation_pkey" PRIMARY KEY ("lang", "key")
);

CREATE INDEX "UiTranslation_lang_idx" ON "UiTranslation" ("lang");
