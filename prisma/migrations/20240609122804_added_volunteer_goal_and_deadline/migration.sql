/*
  Warnings:

  - You are about to drop the column `deadline` on the `Project` table. All the data in the column will be lost.
  - Added the required column `fundingGoalDeadline` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volunteerGoal` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volunteerGoalDeadline` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "deadline",
ADD COLUMN     "fundingGoalDeadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "volunteerGoal" INTEGER NOT NULL,
ADD COLUMN     "volunteerGoalDeadline" TIMESTAMP(3) NOT NULL;
