-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Masculino', 'Femenino', 'Unisex');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'Unisex';
