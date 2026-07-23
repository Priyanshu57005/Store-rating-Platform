import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const ownerPassword = await bcrypt.hash("Owner@123", 10);
  const userPassword = await bcrypt.hash("User@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      address: "Admin Address",
      role: Role.ADMIN,
    },
  });

  // Store Owner
  const owner = await prisma.user.create({
    data: {
      name: "Store Owner",
      email: "owner@example.com",
      password: ownerPassword,
      address: "Owner Address",
      role: Role.STORE_OWNER,
    },
  });

  // Normal User
  const user = await prisma.user.create({
    data: {
      name: "Normal User",
      email: "user@example.com",
      password: userPassword,
      address: "User Address",
      role: Role.USER,
    },
  });

  // Store
  const store = await prisma.store.create({
    data: {
      name: "Demo Store",
      email: "store@example.com",
      address: "Store Address",
      ownerId: owner.id,
    },
  });

  // Rating
  await prisma.rating.create({
    data: {
      userId: user.id,
      storeId: store.id,
      value: 5,
      comment: "Excellent Store!",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });