/*
  Warnings:

  - A unique constraint covering the columns `[volunteerId,projectId]` on the table `ProjectVolunteer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectVolunteer_volunteerId_projectId_key" ON "ProjectVolunteer"("volunteerId", "projectId");
