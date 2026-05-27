/*
  Warnings:

  - You are about to drop the column `market` on the `Fill` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Fill` table. All the data in the column will be lost.
  - You are about to drop the column `market` on the `PositionRecord` table. All the data in the column will be lost.
  - Added the required column `marketId` to the `Fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qty` to the `Fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketId` to the `PositionRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fill" DROP COLUMN "market",
DROP COLUMN "quantity",
ADD COLUMN     "marketId" TEXT NOT NULL,
ADD COLUMN     "qty" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PositionRecord" DROP COLUMN "market",
ADD COLUMN     "marketId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Fill" ADD CONSTRAINT "Fill_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionRecord" ADD CONSTRAINT "PositionRecord_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE RESTRICT ON UPDATE CASCADE;
