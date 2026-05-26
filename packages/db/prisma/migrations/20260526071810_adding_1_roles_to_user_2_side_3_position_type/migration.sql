/*
  Warnings:

  - You are about to drop the column `type` on the `OrderRecord` table. All the data in the column will be lost.
  - Added the required column `side` to the `OrderRecord` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `PositionRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Side" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "PositionType" AS ENUM ('SHORT', 'LONG');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "OrderRecord" DROP COLUMN "type",
ADD COLUMN     "side" "Side" NOT NULL;

-- AlterTable
ALTER TABLE "PositionRecord" DROP COLUMN "type",
ADD COLUMN     "type" "PositionType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL;

-- DropEnum
DROP TYPE "Type";
