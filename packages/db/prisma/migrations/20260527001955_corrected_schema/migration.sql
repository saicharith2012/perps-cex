/*
  Warnings:

  - You are about to drop the column `long` on the `Fill` table. All the data in the column will be lost.
  - You are about to drop the column `short` on the `Fill` table. All the data in the column will be lost.
  - You are about to drop the column `margin` on the `OrderRecord` table. All the data in the column will be lost.
  - You are about to drop the column `market` on the `OrderRecord` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `OrderRecord` table. All the data in the column will be lost.
  - Added the required column `filledQty` to the `OrderRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialMargin` to the `OrderRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketId` to the `OrderRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qty` to the `OrderRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fill" DROP COLUMN "long",
DROP COLUMN "short",
ALTER COLUMN "quantity" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "OrderRecord" DROP COLUMN "margin",
DROP COLUMN "market",
DROP COLUMN "quantity",
ADD COLUMN     "filledQty" TEXT NOT NULL,
ADD COLUMN     "initialMargin" TEXT NOT NULL,
ADD COLUMN     "marketId" TEXT NOT NULL,
ADD COLUMN     "qty" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE TEXT,
ALTER COLUMN "leverage" SET DATA TYPE TEXT,
ALTER COLUMN "slippage" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PositionRecord" ALTER COLUMN "margin" SET DATA TYPE TEXT,
ALTER COLUMN "liquidationPrice" SET DATA TYPE TEXT,
ALTER COLUMN "averagePrice" SET DATA TYPE TEXT,
ALTER COLUMN "equity" SET DATA TYPE TEXT,
ALTER COLUMN "positionSize" SET DATA TYPE TEXT,
ALTER COLUMN "realisedPnL" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "OrderRecord" ADD CONSTRAINT "OrderRecord_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE RESTRICT ON UPDATE CASCADE;
