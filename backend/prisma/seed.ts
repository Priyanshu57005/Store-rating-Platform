import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash('Admin@1234Password', 10);
  const ownerPasswordHash = await bcrypt.hash('Owner@1234Password', 10);
  const userPasswordHash = await bcrypt.hash('User@1234Password', 10);

  // 1. Create System Administrator
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator Master Account',
      email: 'admin@storerating.com',
      password: adminPasswordHash,
      address: '742 Evergreen Terrace, Sector 14, Silicon Valley Administrative HQ',
      role: Role.ADMIN,
    },
  });

  // 2. Create Store Owners
  const owner1 = await prisma.user.create({
    data: {
      name: 'Marcus Aurelius Store Owner Account',
      email: 'owner.marcus@techemporium.com',
      password: ownerPasswordHash,
      address: '100 Innovation Parkway, Suite 400, Tech City, California 90210',
      role: Role.STORE_OWNER,
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Elena Rostova Store Owner Executive',
      email: 'owner.elena@artisanbakery.com',
      password: ownerPasswordHash,
      address: '45 Baker Street, Old Quarter District, New York 10001',
      role: Role.STORE_OWNER,
    },
  });

  // 3. Create Normal Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Christopher Alexander Davis Junior',
      email: 'christopher.davis@example.com',
      password: userPasswordHash,
      address: '123 Maple Street, Apartment 4B, Springfield, IL 62701',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Sophia Catherine Miller Williams',
      email: 'sophia.miller@example.com',
      password: userPasswordHash,
      address: '789 Oak Avenue, Suite 12, Seattle, WA 98101',
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Jonathan Edward Harrison Smith',
      email: 'jonathan.harrison@example.com',
      password: userPasswordHash,
      address: '555 Pine Boulevard, Unit 302, Austin, TX 78701',
      role: Role.USER,
    },
  });

  // 4. Create Stores
  const store1 = await prisma.store.create({
    data: {
      name: 'Nexus Electronics & Gadgets Hub',
      email: 'contact@nexuselectronics.com',
      address: '100 Innovation Parkway, Suite 400, Tech City, California 90210',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Artisan Gourmet & Fresh Bakery',
      email: 'info@artisanbakery.com',
      address: '45 Baker Street, Old Quarter District, New York 10001',
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'Urban Outfitters Fashion Store',
      email: 'support@urbanfashion.com',
      address: '888 Fashion Boulevard, Shopping District, Chicago 60601',
      ownerId: null,
    },
  });

  // 5. Create Ratings
  await prisma.rating.createMany({
    data: [
      {
        userId: user1.id,
        storeId: store1.id,
        value: 5,
        comment: 'Exceptional customer service and latest tech inventory!',
      },
      {
        userId: user2.id,
        storeId: store1.id,
        value: 4,
        comment: 'Great selection of items, fast checkout process.',
      },
      {
        userId: user3.id,
        storeId: store1.id,
        value: 5,
        comment: 'Outstanding experience. Highly recommended.',
      },
      {
        userId: user1.id,
        storeId: store2.id,
        value: 4,
        comment: 'Delicious fresh pastries every morning!',
      },
      {
        userId: user2.id,
        storeId: store2.id,
        value: 5,
        comment: 'Best sourdough bread in the city!',
      },
      {
        userId: user3.id,
        storeId: store3.id,
        value: 3,
        comment: 'Good clothing options but customer service was average.',
      },
    ],
  });

  console.log('✅ Seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Credentials Summary:');
  console.log('Admin User:        admin@storerating.com / Admin@1234Password');
  console.log('Store Owner 1:     owner.marcus@techemporium.com / Owner@1234Password');
  console.log('Store Owner 2:     owner.elena@artisanbakery.com / Owner@1234Password');
  console.log('Normal User 1:     christopher.davis@example.com / User@1234Password');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
