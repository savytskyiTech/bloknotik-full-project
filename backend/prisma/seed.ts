import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, addHours, setHours, setMinutes, startOfTomorrow } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clean existing data
  await prisma.lessonNote.deleteMany();
  await prisma.waitlistEntry.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash('password123', 12);

  // ─── Create Manager ───────────────────────────────

  const manager = await prisma.user.create({
    data: {
      email: 'manager@bloknotik.ua',
      password_hash: hash,
      name: 'Марія Коваленко',
      role: Role.manager,
    },
  });
  console.log(`✅ Manager: ${manager.email}`);

  // ─── Create Instructors ───────────────────────────

  const instructor1 = await prisma.user.create({
    data: {
      email: 'instructor1@bloknotik.ua',
      password_hash: hash,
      name: 'Олександр Петренко',
      role: Role.instructor,
    },
  });

  const instructor2 = await prisma.user.create({
    data: {
      email: 'instructor2@bloknotik.ua',
      password_hash: hash,
      name: 'Іван Сидоренко',
      role: Role.instructor,
    },
  });
  console.log(`✅ Instructors: ${instructor1.email}, ${instructor2.email}`);

  // ─── Create Students ──────────────────────────────

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@bloknotik.ua',
      password_hash: hash,
      name: 'Анна Мельник',
      role: Role.student,
      assigned_instructor_id: instructor1.id,
      total_hours_driven: 5.5,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@bloknotik.ua',
      password_hash: hash,
      name: 'Дмитро Бондаренко',
      role: Role.student,
      assigned_instructor_id: instructor1.id,
      total_hours_driven: 3.0,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: 'student3@bloknotik.ua',
      password_hash: hash,
      name: 'Олена Шевченко',
      role: Role.student,
      assigned_instructor_id: instructor2.id,
      total_hours_driven: 8.0,
    },
  });
  console.log(`✅ Students: ${student1.email}, ${student2.email}, ${student3.email}`);

  // ─── Create Slots (tomorrow and day after) ────────

  const tomorrow = startOfTomorrow();

  // Instructor 1 — 4 slots over 2 days
  const slotsData = [
    { instructor: instructor1, day: 0, hour: 9, durationH: 1.5 },
    { instructor: instructor1, day: 0, hour: 11, durationH: 1 },
    { instructor: instructor1, day: 0, hour: 14, durationH: 2 },
    { instructor: instructor1, day: 1, hour: 10, durationH: 1.5 },
    // Instructor 2 — 3 slots
    { instructor: instructor2, day: 0, hour: 9, durationH: 2 },
    { instructor: instructor2, day: 0, hour: 12, durationH: 1 },
    { instructor: instructor2, day: 1, hour: 9, durationH: 1.5 },
  ];

  const createdSlots = [];
  for (const s of slotsData) {
    const dayDate = addDays(tomorrow, s.day);
    const start = setMinutes(setHours(dayDate, s.hour), 0);
    const end = addHours(start, s.durationH);

    const slot = await prisma.slot.create({
      data: {
        instructor_id: s.instructor.id,
        start_time: start,
        end_time: end,
        status: 'available',
      },
    });
    createdSlots.push(slot);
  }
  console.log(`✅ Created ${createdSlots.length} slots`);

  // ─── Create a sample booking ──────────────────────

  const booking = await prisma.booking.create({
    data: {
      slot_id: createdSlots[0].id,
      student_id: student1.id,
      status: 'confirmed',
    },
  });

  await prisma.slot.update({
    where: { id: createdSlots[0].id },
    data: { status: 'booked' },
  });
  console.log(`✅ Sample booking created for ${student1.name}`);

  // ─── Summary ──────────────────────────────────────

  console.log('\n🎉 Seeding complete!\n');
  console.log('📋 Test accounts (password: password123):');
  console.log(`   Manager:     ${manager.email}`);
  console.log(`   Instructor:  ${instructor1.email}`);
  console.log(`   Instructor:  ${instructor2.email}`);
  console.log(`   Student:     ${student1.email} (→ ${instructor1.name})`);
  console.log(`   Student:     ${student2.email} (→ ${instructor1.name})`);
  console.log(`   Student:     ${student3.email} (→ ${instructor2.name})`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
