import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function parseDateTime(value: unknown): Date | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const isoLike = value.includes("T") ? value : value.replace(" ", "T");
  const d = new Date(isoLike);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function readJson<T>(filename: string): Promise<T> {
  const fullPath = path.join(process.cwd(), "db", filename);
  const raw = await readFile(fullPath, "utf8");
  return JSON.parse(raw) as T;
}

type SeedUser = {
  id: string;
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  phoneVerified?: boolean;
  personalIdNumber: string;
  city?: string | null;
  address?: string | null;
  postalIndex?: string | null;
  termsAcceptedAt?: string | null;
  balance?: number;
  roomNumber?: string | null;
  role?: "USER" | "ADMIN" | "EMPLOYEE" | "SUPPORT";
  employeeCountry?:
    | "GB"
    | "US"
    | "CN"
    | "GR"
    | "FR"
    | "TR"
    | null;
  createdAt?: string;
  updatedAt?: string;
};

type SeedAddress = {
  id: string;
  userId: string;
  type: string;
  country: string;
  city: string;
  street: string;
  building?: string | null;
  apartment?: string | null;
  postalCode?: string | null;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type SeedTariff = {
  id: string;
  originCountry: string;
  destinationCountry?: string;
  minWeight?: number;
  maxWeight?: number | null;
  pricePerKg: number;
  currency?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type SeedReis = {
  id: string;
  name: string;
  originCountry: string;
  destinationCountry?: string;
  departureAt?: string | null;
  arrivalAt?: string | null;
  status?: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type SeedParcel = {
  id: string;
  userId: string;
  trackingNumber: string;
  status?: string;
  customerName: string;
  price: number;
  onlineShop: string;
  quantity: number;
  comment?: string | null;
  originCountry?: string | null;
  originAddress?: string | null;
  destinationAddressId?: string | null;
  weight?: number | null;
  volumetricWeight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  description?: string | null;
  currency?: string;
  shippingAmount?: number | null;
  filePath?: string | null;
  customsValue?: number | null;
  customsDeclared?: boolean;
  courierServiceRequested?: boolean;
  courierFeeAmount?: number | null;
  payableAmount?: number | null;
  shippedAt?: string | null;
  arrivedAt?: string | null;
  readyAt?: string | null;
  deliveredAt?: string | null;
  reisId?: string | null;
  createdById?: string | null;
  smsSent?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type SeedTracking = {
  id: string;
  parcelId: string;
  status: string;
  location?: string | null;
  description?: string | null;
  createdAt?: string;
};

type SeedPayment = {
  id: string;
  userId: string;
  parcelId?: string | null;
  orderId?: string | null;
  amount: number;
  currency?: string;
  status?: string;
  paymentMethod: string;
  transactionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type SeedChatThread = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status?: string;
  userId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type SeedChatMessage = {
  id: string;
  threadId: string;
  sender: "USER" | "ADMIN";
  text: string;
  createdAt?: string;
};

async function seed() {
  const [
    users,
    addresses,
    tariffs,
    reises,
    parcels,
    trackings,
    payments,
    chatThreads,
    chatMessages,
  ] = await Promise.all([
    readJson<SeedUser[]>("users.json"),
    readJson<SeedAddress[]>("addresses.json"),
    readJson<SeedTariff[]>("tariffs.json"),
    readJson<SeedReis[]>("reises.json"),
    readJson<SeedParcel[]>("parcels.json"),
    readJson<SeedTracking[]>("trackings.json"),
    readJson<SeedPayment[]>("payments.json"),
    readJson<SeedChatThread[]>("chat_threads.json"),
    readJson<SeedChatMessage[]>("chat_messages.json"),
  ]);

  // Clear existing data (children -> parents)
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.tracking.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.address.deleteMany();
  await prisma.tariff.deleteMany();
  await prisma.reis.deleteMany();
  await prisma.user.deleteMany();

  // Insert data (parents -> children)
  await prisma.user.createMany({
    data: users.map((u) => ({
      id: u.id,
      email: u.email,
      password: u.password,
      firstName: u.firstName ?? undefined,
      lastName: u.lastName ?? undefined,
      phone: u.phone ?? undefined,
      phoneVerified: u.phoneVerified ?? undefined,
      personalIdNumber: u.personalIdNumber,
      city: u.city ?? undefined,
      address: u.address ?? undefined,
      postalIndex: u.postalIndex ?? undefined,
      termsAcceptedAt: parseDateTime(u.termsAcceptedAt) ?? undefined,
      balance: u.balance ?? undefined,
      roomNumber: u.roomNumber ?? undefined,
      role: u.role ?? undefined,
      employeeCountry: u.employeeCountry ?? undefined,
      createdAt: parseDateTime(u.createdAt) ?? undefined,
      updatedAt: parseDateTime(u.updatedAt) ?? undefined,
    })),
    skipDuplicates: true,
  });

  await prisma.address.createMany({
    data: addresses.map((a) => ({
      id: a.id,
      userId: a.userId,
      type: a.type,
      country: a.country,
      city: a.city,
      street: a.street,
      building: a.building ?? undefined,
      apartment: a.apartment ?? undefined,
      postalCode: a.postalCode ?? undefined,
      isDefault: a.isDefault ?? undefined,
      createdAt: parseDateTime(a.createdAt) ?? undefined,
      updatedAt: parseDateTime(a.updatedAt) ?? undefined,
    })),
    skipDuplicates: true,
  });

  await prisma.tariff.createMany({
    data: tariffs.map((t) => ({
      id: t.id,
      originCountry: t.originCountry,
      destinationCountry: t.destinationCountry ?? undefined,
      minWeight: t.minWeight ?? undefined,
      maxWeight: t.maxWeight ?? undefined,
      pricePerKg: t.pricePerKg,
      currency: t.currency ?? undefined,
      isActive: t.isActive ?? undefined,
      createdAt: parseDateTime(t.createdAt) ?? undefined,
      updatedAt: parseDateTime(t.updatedAt) ?? undefined,
    })),
    skipDuplicates: true,
  });

  await prisma.reis.createMany({
    data: reises.map((r) => ({
      id: r.id,
      name: r.name,
      originCountry: r.originCountry,
      destinationCountry: r.destinationCountry ?? undefined,
      departureAt: parseDateTime(r.departureAt) ?? undefined,
      arrivalAt: parseDateTime(r.arrivalAt) ?? undefined,
      status: r.status ?? undefined,
      notes: r.notes ?? undefined,
      createdAt: parseDateTime(r.createdAt) ?? undefined,
      updatedAt: parseDateTime(r.updatedAt) ?? undefined,
    })),
    skipDuplicates: true,
  });

  await prisma.parcel.createMany({
    data: parcels.map((p) => ({
      id: p.id,
      userId: p.userId,
      trackingNumber: p.trackingNumber,
      status: (p.status as any) ?? undefined,
      customerName: p.customerName,
      price: p.price,
      onlineShop: p.onlineShop,
      quantity: p.quantity,
      comment: p.comment ?? undefined,
      originCountry: p.originCountry ?? undefined,
      originAddress: p.originAddress ?? undefined,
      destinationAddressId: p.destinationAddressId ?? undefined,
      weight: p.weight ?? undefined,
      volumetricWeight: p.volumetricWeight ?? undefined,
      length: p.length ?? undefined,
      width: p.width ?? undefined,
      height: p.height ?? undefined,
      description: p.description ?? undefined,
      currency: p.currency ?? undefined,
      shippingAmount: p.shippingAmount ?? undefined,
      filePath: p.filePath ?? undefined,
      customsValue: p.customsValue ?? undefined,
      customsDeclared: p.customsDeclared ?? undefined,
      courierServiceRequested: p.courierServiceRequested ?? undefined,
      courierFeeAmount: p.courierFeeAmount ?? undefined,
      payableAmount: p.payableAmount ?? undefined,
      shippedAt: parseDateTime(p.shippedAt) ?? undefined,
      arrivedAt: parseDateTime(p.arrivedAt) ?? undefined,
      readyAt: parseDateTime(p.readyAt) ?? undefined,
      deliveredAt: parseDateTime(p.deliveredAt) ?? undefined,
      reisId: p.reisId ?? undefined,
      createdById: p.createdById ?? undefined,
      smsSent: p.smsSent ?? undefined,
      createdAt: parseDateTime(p.createdAt) ?? undefined,
      updatedAt: parseDateTime(p.updatedAt) ?? undefined,
    })),
    skipDuplicates: true,
  });

  await prisma.tracking.createMany({
    data: trackings.map((t) => ({
      id: t.id,
      parcelId: t.parcelId,
      status: t.status,
      location: t.location ?? undefined,
      description: t.description ?? undefined,
      createdAt: parseDateTime(t.createdAt) ?? undefined,
    })),
    skipDuplicates: true,
  });

  await prisma.payment.createMany({
    data: payments.map((p) => ({
      id: p.id,
      userId: p.userId,
      parcelId: p.parcelId ?? undefined,
      orderId: p.orderId ?? undefined,
      amount: p.amount,
      currency: p.currency ?? undefined,
      status: p.status ?? undefined,
      paymentMethod: p.paymentMethod,
      transactionId: p.transactionId ?? undefined,
      createdAt: parseDateTime(p.createdAt) ?? undefined,
      updatedAt: parseDateTime(p.updatedAt) ?? undefined,
    })),
    skipDuplicates: true,
  });

  await prisma.chatThread.createMany({
    data: chatThreads.map((t) => ({
      id: t.id,
      firstName: t.firstName,
      lastName: t.lastName,
      email: t.email,
      phone: t.phone,
      status: t.status ?? undefined,
      userId: t.userId ?? undefined,
      createdAt: parseDateTime(t.createdAt) ?? undefined,
      updatedAt: parseDateTime(t.updatedAt) ?? undefined,
    })),
    skipDuplicates: true,
  });

  await prisma.chatMessage.createMany({
    data: chatMessages.map((m) => ({
      id: m.id,
      threadId: m.threadId,
      sender: m.sender,
      text: m.text,
      createdAt: parseDateTime(m.createdAt) ?? undefined,
    })),
    skipDuplicates: true,
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

