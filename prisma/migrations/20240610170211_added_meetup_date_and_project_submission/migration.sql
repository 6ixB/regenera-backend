-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "meetupDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ProjectSubmission" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "objectiveId" TEXT NOT NULL,
    "submitterId" TEXT NOT NULL,

    CONSTRAINT "ProjectSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSubmission_objectiveId_key" ON "ProjectSubmission"("objectiveId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSubmission_submitterId_key" ON "ProjectSubmission"("submitterId");

-- AddForeignKey
ALTER TABLE "ProjectSubmission" ADD CONSTRAINT "ProjectSubmission_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "ProjectObjective"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSubmission" ADD CONSTRAINT "ProjectSubmission_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
