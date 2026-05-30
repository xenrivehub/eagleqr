-- İşletme görüntüleme para birimi (ISO 4217)
ALTER TABLE "Business" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'TRY';
