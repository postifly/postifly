-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'EMPLOYEE', 'SUPPORT');

-- CreateEnum
CREATE TYPE "EmployeeCountry" AS ENUM ('GB', 'US', 'CN', 'IT', 'GR', 'ES', 'FR', 'DE', 'TR');

-- CreateEnum
CREATE TYPE "ChatSender" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('pending', 'in_warehouse', 'in_transit', 'arrived', 'region', 'ready_for_pickup', 'delivered', 'stopped', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "personalIdNumber" TEXT NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "postalIndex" TEXT,
    "termsAcceptedAt" TIMESTAMP(3),
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roomNumber" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "employeeCountry" "EmployeeCountry",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_otps" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phone_otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "building" TEXT,
    "apartment" TEXT,
    "postalCode" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcels" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "status" "ParcelStatus" NOT NULL DEFAULT 'pending',
    "customerName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "onlineShop" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "comment" TEXT,
    "originCountry" TEXT,
    "originAddress" TEXT,
    "destinationAddressId" TEXT,
    "weight" DOUBLE PRECISION,
    "volumetricWeight" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "description" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'GEL',
    "shippingAmount" DOUBLE PRECISION,
    "filePath" TEXT,
    "customsValue" DOUBLE PRECISION,
    "customsDeclared" BOOLEAN NOT NULL DEFAULT false,
    "courierServiceRequested" BOOLEAN NOT NULL DEFAULT false,
    "courierFeeAmount" DOUBLE PRECISION,
    "payableAmount" DOUBLE PRECISION,
    "smsSent" BOOLEAN NOT NULL DEFAULT false,
    "shippedAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "readyAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "reisId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trackings" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trackings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parcelId" TEXT,
    "orderId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GEL',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parcelId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GEL',
    "weight" TEXT NOT NULL DEFAULT '',
    "smsSent" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariffs" (
    "id" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL DEFAULT 'GE',
    "minWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxWeight" DOUBLE PRECISION,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GEL',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'GE',
    "phone" TEXT,
    "email" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "workingHours" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL DEFAULT 'GE',
    "departureAt" TIMESTAMP(3),
    "arrivalAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'open',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_threads" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "chat_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "sender" "ChatSender" NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declarations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GEL',
    "filePath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "declarations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_personalIdNumber_key" ON "users"("personalIdNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_roomNumber_key" ON "users"("roomNumber");

-- CreateIndex
CREATE INDEX "phone_otps_phone_idx" ON "phone_otps"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "parcels_trackingNumber_key" ON "parcels"("trackingNumber");

-- CreateIndex
CREATE INDEX "parcels_userId_idx" ON "parcels"("userId");

-- CreateIndex
CREATE INDEX "parcels_status_idx" ON "parcels"("status");

-- CreateIndex
CREATE INDEX "parcels_status_createdAt_idx" ON "parcels"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "parcels_status_originCountry_createdAt_idx" ON "parcels"("status", "originCountry", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "parcels_status_createdAt_id_idx" ON "parcels"("status", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "parcels_status_originCountry_createdAt_id_idx" ON "parcels"("status", "originCountry", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "parcels_createdById_idx" ON "parcels"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "orders_parcelId_key" ON "orders"("parcelId");

-- CreateIndex
CREATE INDEX "tariffs_isActive_destinationCountry_idx" ON "tariffs"("isActive", "destinationCountry");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_destinationAddressId_fkey" FOREIGN KEY ("destinationAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_reisId_fkey" FOREIGN KEY ("reisId") REFERENCES "reises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trackings" ADD CONSTRAINT "trackings_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "parcels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "parcels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "chat_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
