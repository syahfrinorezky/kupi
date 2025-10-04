/*
  Warnings:

  - A unique constraint covering the columns `[sessionToken]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `VerificationToken` ADD COLUMN `sessionToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `VerificationToken_sessionToken_key` ON `VerificationToken`(`sessionToken`);

-- CreateIndex
CREATE INDEX `VerificationToken_sessionToken_idx` ON `VerificationToken`(`sessionToken`);
