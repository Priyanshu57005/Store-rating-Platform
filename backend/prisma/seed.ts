import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with Indian store names and locations...');

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
      name: 'System Administrator Master Coordinator',
      email: 'admin@storerating.com',
      password: adminPasswordHash,
      address: 'Plot No. 42, Cyber City, Sector 24, DLF Phase 3, Gurugram, Haryana 122002',
      role: Role.ADMIN,
    },
  });

  // 2. Create Store Owners
  const owner1 = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar Sharma Store Management',
      email: 'owner.rajesh@sharmatronics.in',
      password: ownerPasswordHash,
      address: 'Shop No. 12, Connaught Place Block C, Outer Circle, New Delhi 110001',
      role: Role.STORE_OWNER,
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Priya Ramesh Kulkarni Executive Manager',
      email: 'owner.priya@kulkarnisweets.in',
      password: ownerPasswordHash,
      address: 'FC Road, Opposite Ferguson College Campus, Shivajinagar, Pune, Maharashtra 411004',
      role: Role.STORE_OWNER,
    },
  });

  // 3. Create Normal Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Aarav Vikramaditya Singh Thakur',
      email: 'aarav.singh@example.in',
      password: userPasswordHash,
      address: 'Flat 402, Royal Palms Apartments, MG Road, Indiranagar, Bengaluru, Karnataka 560038',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Ananya Srinivasan Venkatesh Iyer',
      email: 'ananya.venkatesh@example.in',
      password: userPasswordHash,
      address: 'Door No. 18/4, T. Nagar Main Street, Near Panagal Park, Chennai, Tamil Nadu 600017',
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Rohan Deshmukh Patil Maharashtra',
      email: 'rohan.deshmukh@example.in',
      password: userPasswordHash,
      address: '101 Heritage Towers, Bandra West, Hill Road, Mumbai, Maharashtra 400050',
      role: Role.USER,
    },
  });

  // 4. Create Stores (Indian Store Names & Locations)
  const store1 = await prisma.store.create({
    data: {
      name: 'Sharma Electronics & Mobile Superstore',
      email: 'support@sharmatronics.in',
      address: 'Shop No. 12, Connaught Place Block C, Outer Circle, New Delhi 110001',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Kulkarni Mithai Mandir & Fresh Bakery',
      email: 'contact@kulkarnisweets.in',
      address: 'FC Road, Opposite Ferguson College Campus, Shivajinagar, Pune, Maharashtra 411004',
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'Jaipur Handicrafts & Ethnic Textiles',
      email: 'info@jaipurtextiles.in',
      address: 'Johari Bazaar Market, Pink City, Jaipur, Rajasthan 302003',
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
        comment: 'Best place for authentic gadgets in Delhi. Great prices and prompt service!',
      },
      {
        userId: user2.id,
        storeId: store1.id,
        value: 4,
        comment: 'Quick mobile repair service and polite store staff.',
      },
      {
        userId: user3.id,
        storeId: store1.id,
        value: 5,
        comment: 'Prompt warranty support and 100% genuine products.',
      },
      {
        userId: user1.id,
        storeId: store2.id,
        value: 4,
        comment: 'Delicious fresh sweets, highly recommend their Kaju Katli!',
      },
      {
        userId: user2.id,
        storeId: store2.id,
        value: 5,
        comment: 'Pure ghee sweets and extremely clean packaging.',
      },
      {
        userId: user3.id,
        storeId: store3.id,
        value: 3,
        comment: 'Nice traditional saree collection, but prices are slightly high.',
      },
    ],
  });

  console.log('✅ Seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Credentials Summary:');
  console.log('Admin User:        admin@storerating.com / Admin@1234Password');
  console.log('Store Owner 1:     owner.rajesh@sharmatronics.in / Owner@1234Password');
  console.log('Store Owner 2:     owner.priya@kulkarnisweets.in / Owner@1234Password');
  console.log('Normal User 1:     aarav.singh@example.in / User@1234Password');
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
