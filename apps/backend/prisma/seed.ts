import { PrismaClient, UserRole, BarberStatus, AppointmentStatus, DayOfWeek } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password for all users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Clean existing data
  console.log('🗑️  Cleaning existing data...');
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.shopBarber.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.barberProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creating users...');
  
  // Create Admin
  const admin = await prisma.user.create({
    data: {
      id: 'admin-001',
      email: 'admin@barberly.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  // Create Barbers
  const barber1 = await prisma.user.create({
    data: {
      id: 'barber-001',
      email: 'mike.johnson@barberly.com',
      passwordHash,
      firstName: 'Mike',
      lastName: 'Johnson',
      phone: '+1234567891',
      role: UserRole.BARBER,
      isActive: true,
      barberProfile: {
        create: {
          id: 'bp-001',
          bio: 'Master barber with 10+ years of experience. Specializing in classic cuts and modern styles.',
          specialty: 'Classic Haircuts, Beard Grooming, Hot Towel Shaves',
          experience: 10,
          rating: 4.8,
          reviewCount: 156,
          status: BarberStatus.APPROVED,
        },
      },
    },
  });

  const barber2 = await prisma.user.create({
    data: {
      id: 'barber-002',
      email: 'david.brown@barberly.com',
      passwordHash,
      firstName: 'David',
      lastName: 'Brown',
      phone: '+1234567892',
      role: UserRole.BARBER,
      isActive: true,
      barberProfile: {
        create: {
          id: 'bp-002',
          bio: 'Professional barber focused on precision cuts and beard designs.',
          specialty: 'Fade Haircuts, Beard Design, Hair Coloring',
          experience: 8,
          rating: 4.7,
          reviewCount: 98,
          status: BarberStatus.APPROVED,
        },
      },
    },
  });

  const barber3 = await prisma.user.create({
    data: {
      id: 'barber-003',
      email: 'emma.davis@barberly.com',
      passwordHash,
      firstName: 'Emma',
      lastName: 'Davis',
      phone: '+1234567893',
      role: UserRole.BARBER,
      isActive: true,
      barberProfile: {
        create: {
          id: 'bp-003',
          bio: 'Creative stylist with expertise in modern cuts and color.',
          specialty: 'Modern Styling, Hair Coloring, Perms',
          experience: 12,
          rating: 4.9,
          reviewCount: 203,
          status: BarberStatus.APPROVED,
        },
      },
    },
  });

  console.log('✅ Created 1 admin and 3 barbers');

  // Create Customers
  const customer1 = await prisma.user.create({
    data: {
      id: 'customer-001',
      email: 'john.doe@example.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567896',
      role: UserRole.CUSTOMER,
      isActive: true,
      customerProfile: {
        create: {
          id: 'cp-001',
        },
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      id: 'customer-002',
      email: 'jane.smith@example.com',
      passwordHash,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567897',
      role: UserRole.CUSTOMER,
      isActive: true,
      customerProfile: {
        create: {
          id: 'cp-002',
        },
      },
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      id: 'customer-003',
      email: 'alex.johnson@example.com',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Johnson',
      phone: '+1234567898',
      role: UserRole.CUSTOMER,
      isActive: true,
      customerProfile: {
        create: {
          id: 'cp-003',
        },
      },
    },
  });

  console.log('✅ Created 3 customers');

  // Create Shops
  console.log('🏪 Creating shops...');
  const shop1 = await prisma.shop.create({
    data: {
      id: 'shop-001',
      name: 'Downtown Barbershop',
      description: 'Premium barbershop in the heart of downtown.',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1234567890',
      email: 'downtown@barberly.com',
      isActive: true,
    },
  });

  const shop2 = await prisma.shop.create({
    data: {
      id: 'shop-002',
      name: 'West Side Cuts',
      description: 'Modern barbershop with a relaxed atmosphere.',
      address: '456 West Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      phone: '+1234567891',
      email: 'westside@barberly.com',
      isActive: true,
    },
  });

  console.log('✅ Created 2 shops');

  // Assign Barbers to Shops
  console.log('🔗 Assigning barbers to shops...');
  await prisma.shopBarber.createMany({
    data: [
      {
        id: 'sa-001',
        barberId: 'bp-001',
        shopId: 'shop-001',
        startDate: new Date(Date.now() - 365 * 2 * 24 * 60 * 60 * 1000), // 2 years ago
        isActive: true,
      },
      {
        id: 'sa-002',
        barberId: 'bp-002',
        shopId: 'shop-002',
        startDate: new Date(Date.now() - 365 * 1 * 24 * 60 * 60 * 1000), // 1 year ago
        isActive: true,
      },
      {
        id: 'sa-003',
        barberId: 'bp-003',
        shopId: 'shop-001',
        startDate: new Date(Date.now() - 365 * 3 * 24 * 60 * 60 * 1000), // 3 years ago
        isActive: true,
      },
    ],
  });

  console.log('✅ Assigned barbers to shops');

  // Create Services
  console.log('💈 Creating services...');
  await prisma.service.createMany({
    data: [
      // Mike Johnson's Services
      { id: 'srv-001', barberId: 'bp-001', name: 'Classic Haircut', description: 'Traditional haircut with scissors and clippers.', price: 35.00, duration: 30, isActive: true },
      { id: 'srv-002', barberId: 'bp-001', name: 'Premium Fade', description: 'High, mid, or low fade with precision.', price: 45.00, duration: 45, isActive: true },
      { id: 'srv-003', barberId: 'bp-001', name: 'Beard Trim & Shape', description: 'Professional beard trimming.', price: 25.00, duration: 20, isActive: true },
      { id: 'srv-004', barberId: 'bp-001', name: 'Hot Towel Shave', description: 'Traditional straight razor shave.', price: 40.00, duration: 30, isActive: true },
      { id: 'srv-005', barberId: 'bp-001', name: 'Haircut & Beard Combo', description: 'Complete grooming package.', price: 55.00, duration: 60, isActive: true },
      
      // David Brown's Services
      { id: 'srv-006', barberId: 'bp-002', name: 'Signature Fade', description: 'Custom fade design.', price: 50.00, duration: 45, isActive: true },
      { id: 'srv-007', barberId: 'bp-002', name: 'Beard Design', description: 'Creative beard shaping.', price: 30.00, duration: 25, isActive: true },
      { id: 'srv-008', barberId: 'bp-002', name: 'Hair Color', description: 'Professional hair coloring.', price: 80.00, duration: 90, isActive: true },
      
      // Emma Davis's Services
      { id: 'srv-010', barberId: 'bp-003', name: 'Modern Cut & Style', description: 'Contemporary haircut with styling.', price: 60.00, duration: 60, isActive: true },
      { id: 'srv-011', barberId: 'bp-003', name: 'Hair Coloring', description: 'Full or partial hair coloring.', price: 120.00, duration: 120, isActive: true },
      { id: 'srv-012', barberId: 'bp-003', name: 'Deep Conditioning', description: 'Intensive hair treatment.', price: 45.00, duration: 45, isActive: true },
    ],
  });

  console.log('✅ Created 11 services');

  // Create Availability
  console.log('📅 Creating barber availability...');
  const availabilityData = [];
  
  // Mike Johnson - Monday to Saturday
  const days1: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  days1.forEach((day, index) => {
    availabilityData.push({
      id: `ba-00${index + 1}`,
      barberId: 'bp-001',
      dayOfWeek: day,
      startTime: day === 'FRIDAY' ? '09:00' : '09:00',
      endTime: day === 'FRIDAY' ? '20:00' : day === 'SATURDAY' ? '17:00' : '18:00',
    });
  });

  // David Brown - Tuesday to Saturday
  const days2: DayOfWeek[] = ['TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  days2.forEach((day, index) => {
    availabilityData.push({
      id: `ba-0${index + 7}`,
      barberId: 'bp-002',
      dayOfWeek: day,
      startTime: '10:00',
      endTime: day === 'FRIDAY' ? '20:00' : day === 'SATURDAY' ? '18:00' : '19:00',
    });
  });

  // Emma Davis - Monday to Friday
  const days3: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  days3.forEach((day, index) => {
    availabilityData.push({
      id: `ba-${index + 12}`,
      barberId: 'bp-003',
      dayOfWeek: day,
      startTime: '09:00',
      endTime: day === 'FRIDAY' ? '19:00' : '17:00',
    });
  });

  await prisma.availability.createMany({ data: availabilityData });

  console.log('✅ Created availability schedules');

  // Create Appointments
  console.log('📆 Creating appointments...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  const eightDaysAgo = new Date(today);
  eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  await prisma.appointment.createMany({
    data: [
      {
        id: 'apt-001',
        customerId: 'customer-001',
        barberId: 'bp-001',
        serviceId: 'srv-001',
        shopId: 'shop-001',
        date: tenDaysAgo,
        startTime: '10:00',
        endTime: '10:30',
        status: AppointmentStatus.COMPLETED,
        notes: 'Regular customer',
        totalAmount: 35.00,
      },
      {
        id: 'apt-002',
        customerId: 'customer-002',
        barberId: 'bp-003',
        serviceId: 'srv-010',
        shopId: 'shop-001',
        date: eightDaysAgo,
        startTime: '14:00',
        endTime: '15:00',
        status: AppointmentStatus.COMPLETED,
        notes: 'First time customer',
        totalAmount: 60.00,
      },
      {
        id: 'apt-003',
        customerId: 'customer-003',
        barberId: 'bp-002',
        serviceId: 'srv-006',
        shopId: 'shop-002',
        date: fiveDaysAgo,
        startTime: '11:00',
        endTime: '11:45',
        status: AppointmentStatus.COMPLETED,
        totalAmount: 50.00,
      },
      {
        id: 'apt-004',
        customerId: 'customer-001',
        barberId: 'bp-001',
        serviceId: 'srv-004',
        shopId: 'shop-001',
        date: today,
        startTime: '09:00',
        endTime: '09:30',
        status: AppointmentStatus.CONFIRMED,
        notes: 'Prefers close shave',
        totalAmount: 40.00,
      },
      {
        id: 'apt-005',
        customerId: 'customer-002',
        barberId: 'bp-002',
        serviceId: 'srv-007',
        shopId: 'shop-002',
        date: today,
        startTime: '11:30',
        endTime: '11:55',
        status: AppointmentStatus.PENDING,
        notes: 'New design',
        totalAmount: 30.00,
      },
    ],
  });

  console.log('✅ Created 5 appointments');

  // Create Reviews
  console.log('⭐ Creating reviews...');
  await prisma.review.createMany({
    data: [
      {
        id: 'rev-001',
        appointmentId: 'apt-001',
        customerId: 'customer-001',
        rating: 5,
        comment: 'Excellent service! Mike is very professional and gave me exactly the haircut I wanted.',
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'rev-002',
        appointmentId: 'apt-002',
        customerId: 'customer-002',
        rating: 5,
        comment: 'Emma is amazing! She really knows how to style hair and gave me great recommendations.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'rev-003',
        appointmentId: 'apt-003',
        customerId: 'customer-003',
        rating: 4,
        comment: 'Great haircut! David did a fantastic job.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Created 3 reviews');

  // Create Gallery Images
  console.log('🖼️  Creating gallery images...');
  await prisma.galleryImage.createMany({
    data: [
      { id: 'gal-001', barberId: 'bp-001', imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c', caption: 'Classic fade' },
      { id: 'gal-002', barberId: 'bp-001', imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486', caption: 'Premium beard' },
      { id: 'gal-003', barberId: 'bp-002', imageUrl: 'https://images.unsplash.com/photo-1606819717115-9159c900370b', caption: 'Signature fade' },
      { id: 'gal-004', barberId: 'bp-003', imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803', caption: 'Modern styling' },
    ],
  });

  console.log('✅ Created 4 gallery images');

  console.log('\n✨ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('  • Users: 7 (1 admin, 3 barbers, 3 customers)');
  console.log('  • Shops: 2');
  console.log('  • Services: 11');
  console.log('  • Appointments: 5');
  console.log('  • Reviews: 3');
  console.log('  • Gallery Images: 4');
  console.log('\n👤 Test Credentials (all passwords: Password123!):');
  console.log('  • Admin: admin@barberly.com');
  console.log('  • Barbers: mike.johnson@barberly.com, david.brown@barberly.com, emma.davis@barberly.com');
  console.log('  • Customers: john.doe@example.com, jane.smith@example.com, alex.johnson@example.com');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
