-- AlterTable
ALTER TABLE "Pin" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "editionSize" INTEGER,
ADD COLUMN     "rarity" TEXT NOT NULL DEFAULT 'Standard';
