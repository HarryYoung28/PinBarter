/*
  Warnings:

  - You are about to drop the column `senderId` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `listingId` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offererId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_senderId_fkey";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "senderId",
ADD COLUMN     "listingId" TEXT NOT NULL,
ADD COLUMN     "offererConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "offererId" TEXT NOT NULL,
ADD COLUMN     "receiverConfirmed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TradeListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pinId" TEXT NOT NULL,
    "wantsDescription" TEXT NOT NULL,
    "creditFlexibility" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeListing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TradeListing" ADD CONSTRAINT "TradeListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeListing" ADD CONSTRAINT "TradeListing_pinId_fkey" FOREIGN KEY ("pinId") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "TradeListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_offererId_fkey" FOREIGN KEY ("offererId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
