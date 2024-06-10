/*
  Warnings:

  - Added the required column `projectId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "projectId" TEXT NOT NULL;
