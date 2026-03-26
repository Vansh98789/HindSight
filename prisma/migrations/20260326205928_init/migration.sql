-- CreateEnum
CREATE TYPE "EmotionalState" AS ENUM ('CALM', 'ANXIOUS', 'EXCITED', 'PRESSURED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FINANCIAL', 'HEALTH', 'RELATIONSHIP', 'LIFE', 'CAREER');

-- CreateEnum
CREATE TYPE "Stakes" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'IRREVERSIBLE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "options" TEXT[],
    "choiceMade" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "confidencelvl" INTEGER NOT NULL,
    "emotionalState" "EmotionalState" NOT NULL,
    "category" "Category" NOT NULL,
    "stake" "Stakes" NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "outcome" INTEGER NOT NULL,
    "reflection" TEXT NOT NULL,
    "reasoningGoodOrNot" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiasedReport" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "avgConfidence" DOUBLE PRECISION NOT NULL,
    "avgOutCome" DOUBLE PRECISION NOT NULL,
    "biasGap" DOUBLE PRECISION NOT NULL,
    "bestCategory" TEXT NOT NULL,
    "WorstCategory" TEXT NOT NULL,
    "overconfidenceScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiasedReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Review_decisionId_key" ON "Review"("decisionId");

-- CreateIndex
CREATE UNIQUE INDEX "BiasedReport_userId_key" ON "BiasedReport"("userId");

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiasedReport" ADD CONSTRAINT "BiasedReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
