-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sizeMl" DOUBLE PRECISION;

-- Completa los ml de los perfumes ya cargados a partir del nombre ("Sauvage Elixir 100 ml").
UPDATE "Product"
SET "sizeMl" = replace(substring("name" from '(?i)(\d+(?:[.,]\d+)?)\s*ml\M'), ',', '.')::double precision
WHERE "sizeMl" IS NULL AND "name" ~* '\d\s*ml\M';
