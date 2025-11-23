-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "loanAmount" DECIMAL(65,30),
ADD COLUMN     "loanTerm" INTEGER,
ADD COLUMN     "monthlyPayment" DECIMAL(65,30),
ADD COLUMN     "remainingBalance" DECIMAL(65,30);

-- CreateTable
CREATE TABLE "InterestPayment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterestPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterestPayment_userId_idx" ON "InterestPayment"("userId");

-- CreateIndex
CREATE INDEX "InterestPayment_accountId_idx" ON "InterestPayment"("accountId");

-- CreateIndex
CREATE INDEX "InterestPayment_year_month_idx" ON "InterestPayment"("year", "month");

-- CreateIndex
CREATE INDEX "Account_type_idx" ON "Account"("type");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- AddForeignKey
ALTER TABLE "InterestPayment" ADD CONSTRAINT "InterestPayment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestPayment" ADD CONSTRAINT "InterestPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
