/*
  Warnings:

  - A unique constraint covering the columns `[userId,accountNumber]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "accountNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_accountNumber_key" ON "Account"("userId", "accountNumber");
