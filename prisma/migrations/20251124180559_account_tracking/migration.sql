-- CreateTable
CREATE TABLE "AccountBalanceSnapshot" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountBalanceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountBalanceSnapshot_userId_idx" ON "AccountBalanceSnapshot"("userId");

-- CreateIndex
CREATE INDEX "AccountBalanceSnapshot_accountId_date_idx" ON "AccountBalanceSnapshot"("accountId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AccountBalanceSnapshot_accountId_date_key" ON "AccountBalanceSnapshot"("accountId", "date");

-- AddForeignKey
ALTER TABLE "AccountBalanceSnapshot" ADD CONSTRAINT "AccountBalanceSnapshot_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountBalanceSnapshot" ADD CONSTRAINT "AccountBalanceSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
