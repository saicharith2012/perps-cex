/*
  Warnings:

  - You are about to drop the column `pnL` on the `PositionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `PositionRecord` table. All the data in the column will be lost.
  - You are about to drop the `Collateral` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `maker_order_id` to the `Fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taker_order_id` to the `Fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leverage` to the `OrderRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equity` to the `PositionRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionSize` to the `PositionRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realisedPnL` to the `PositionRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Collateral" DROP CONSTRAINT "Collateral_userId_fkey";

-- DropForeignKey
ALTER TABLE "Fill" DROP CONSTRAINT "Fill_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderRecord" DROP CONSTRAINT "OrderRecord_userId_fkey";

-- AlterTable
ALTER TABLE "Fill" ADD COLUMN     "maker_order_id" TEXT NOT NULL,
ADD COLUMN     "taker_order_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderRecord" ADD COLUMN     "leverage" INTEGER NOT NULL,
ADD COLUMN     "slippage" INTEGER;

-- AlterTable
ALTER TABLE "PositionRecord" DROP COLUMN "pnL",
DROP COLUMN "quantity",
ADD COLUMN     "equity" INTEGER NOT NULL,
ADD COLUMN     "positionSize" INTEGER NOT NULL,
ADD COLUMN     "realisedPnL" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Collateral";

-- AddForeignKey
ALTER TABLE "OrderRecord" ADD CONSTRAINT "OrderRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fill" ADD CONSTRAINT "Fill_maker_order_id_fkey" FOREIGN KEY ("maker_order_id") REFERENCES "OrderRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fill" ADD CONSTRAINT "Fill_taker_order_id_fkey" FOREIGN KEY ("taker_order_id") REFERENCES "OrderRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fill" ADD CONSTRAINT "Fill_maker_fkey" FOREIGN KEY ("maker") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fill" ADD CONSTRAINT "Fill_taker_fkey" FOREIGN KEY ("taker") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
