-- Ürün gramaj + porsiyon bilgisi (serbest metin)
ALTER TABLE "Product" ADD COLUMN "weight" TEXT;
ALTER TABLE "Product" ADD COLUMN "portion" TEXT;
