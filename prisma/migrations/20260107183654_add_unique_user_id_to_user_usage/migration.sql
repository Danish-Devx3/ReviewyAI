-- AlterTable
ALTER TABLE "UserUsage" RENAME TO "user_usage";

-- CreateIndex
CREATE UNIQUE INDEX "user_usage_userId_key" ON "user_usage"("userId");
