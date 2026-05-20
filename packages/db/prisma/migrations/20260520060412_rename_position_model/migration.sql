/*
  Warnings:

  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collateral" DROP CONSTRAINT "Collateral_userId_fkey";

-- DropForeignKey
ALTER TABLE "Fill" DROP CONSTRAINT "Fill_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderRecord" DROP CONSTRAINT "OrderRecord_userId_fkey";

-- DropTable
DROP TABLE "Position";

-- CreateTable
CREATE TABLE "PositionRecord" (
    "id" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "margin" INTEGER NOT NULL,
    "liquidationPrice" INTEGER NOT NULL,
    "pnL" INTEGER NOT NULL,
    "averagePrice" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PositionRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Collateral" ADD CONSTRAINT "Collateral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRecord" ADD CONSTRAINT "OrderRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fill" ADD CONSTRAINT "Fill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionRecord" ADD CONSTRAINT "PositionRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
