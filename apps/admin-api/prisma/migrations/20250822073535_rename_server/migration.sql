/*
  Warnings:

  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `server` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."admin";

-- DropTable
DROP TABLE "public"."server";

-- CreateTable
CREATE TABLE "public"."Server" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "apiVersion" TEXT NOT NULL,
    "status" "public"."ServerStatus" NOT NULL DEFAULT 'online',
    "healthy" BOOLEAN NOT NULL DEFAULT true,
    "cpuCores" INTEGER NOT NULL,
    "ramGB" DOUBLE PRECISION NOT NULL,
    "region" "public"."ServerRegion" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."AdminRole" NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
