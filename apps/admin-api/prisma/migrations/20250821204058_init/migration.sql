-- CreateEnum
CREATE TYPE "public"."ServerStatus" AS ENUM ('online', 'offline', 'maintenance');

-- CreateEnum
CREATE TYPE "public"."ServerRegion" AS ENUM ('India', 'US_East', 'Canada');

-- CreateEnum
CREATE TYPE "public"."AdminRole" AS ENUM ('basic', 'master');

-- CreateTable
CREATE TABLE "public"."server" (
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

    CONSTRAINT "server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."AdminRole" NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);
