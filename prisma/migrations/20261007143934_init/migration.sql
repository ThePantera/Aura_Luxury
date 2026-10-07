-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Arabian', 'Designer', 'Niche', 'Decant');

-- CreateEnum
CREATE TYPE "Presentation" AS ENUM ('Cerrado', 'Tester', 'Mini Talla');

-- CreateEnum
CREATE TYPE "Usage" AS ENUM ('Gym', 'Office', 'Night', 'Summer', 'Winter');

-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('Best Seller', 'Viral', 'Offer', 'None');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "presentation" "Presentation" NOT NULL DEFAULT 'Cerrado',
    "priceARS" DECIMAL(12,2) NOT NULL,
    "priceUSD" DECIMAL(10,2) NOT NULL,
    "topNotes" TEXT[],
    "heartNotes" TEXT[],
    "baseNotes" TEXT[],
    "recommendedUsage" "Usage"[],
    "durationHours" INTEGER NOT NULL,
    "badge" "Badge" NOT NULL DEFAULT 'None',
    "imageUrl" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");
