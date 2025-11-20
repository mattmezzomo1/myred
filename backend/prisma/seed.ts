import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('senha123', 10);

  // Create test women
  const woman1 = await prisma.user.upsert({
    where: { email: 'marina@teste.com' },
    update: {},
    create: {
      email: 'marina@teste.com',
      password: hashedPassword,
      name: 'Marina Silva',
      userType: 'WOMAN',
      age: 24,
      location: 'São Paulo, SP',
      bio: 'Busco alguém que possa me ajudar a sair dessa situação difícil. Quero construir algo verdadeiro.',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400']),
      verified: false,
    },
  });

  const woman2 = await prisma.user.upsert({
    where: { email: 'juliana@teste.com' },
    update: {},
    create: {
      email: 'juliana@teste.com',
      password: hashedPassword,
      name: 'Juliana Costa',
      userType: 'WOMAN',
      age: 28,
      location: 'São Paulo, SP',
      bio: 'Mãe de duas crianças buscando apoio para recomeçar. Quero um relacionamento sério.',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400']),
      verified: false,
    },
  });

  // Create test men
  const man1 = await prisma.user.upsert({
    where: { email: 'carlos@teste.com' },
    update: {},
    create: {
      email: 'carlos@teste.com',
      password: hashedPassword,
      name: 'Carlos Eduardo',
      userType: 'MAN',
      age: 35,
      location: 'São Paulo, SP',
      bio: 'Empresário buscando relacionamento sério. Quero ajudar alguém a recomeçar.',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400']),
      verified: true,
    },
  });

  const man2 = await prisma.user.upsert({
    where: { email: 'roberto@teste.com' },
    update: {},
    create: {
      email: 'roberto@teste.com',
      password: hashedPassword,
      name: 'Roberto Alves',
      userType: 'MAN',
      age: 42,
      location: 'Rio de Janeiro, RJ',
      bio: 'Médico procurando relacionamento verdadeiro. Posso oferecer estabilidade.',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400']),
      verified: true,
    },
  });

  // Create verification for man1
  await prisma.verification.upsert({
    where: { userId: man1.id },
    update: {},
    create: {
      userId: man1.id,
      documentStatus: 'VERIFIED',
      selfieStatus: 'VERIFIED',
      videoStatus: 'VERIFIED',
      backgroundCheck: true,
      fullyVerified: true,
    },
  });

  // Create a like (woman1 likes man1)
  await prisma.like.create({
    data: {
      senderId: woman1.id,
      receiverId: man1.id,
      matched: false,
    },
  });

  // Create a match (woman2 and man1 matched)
  await prisma.like.create({
    data: {
      senderId: woman2.id,
      receiverId: man1.id,
      matched: true,
    },
  });

  await prisma.like.create({
    data: {
      senderId: man1.id,
      receiverId: woman2.id,
      matched: true,
    },
  });

  // Create some messages between matched users
  await prisma.message.create({
    data: {
      senderId: man1.id,
      receiverId: woman2.id,
      text: 'Olá! Vi seu perfil e gostaria de conversar.',
      flagged: false,
    },
  });

  await prisma.message.create({
    data: {
      senderId: woman2.id,
      receiverId: man1.id,
      text: 'Oi! Obrigada pela mensagem. Também gostei do seu perfil.',
      flagged: false,
    },
  });

  // Create emergency contact for woman1
  await prisma.emergencyContact.create({
    data: {
      userId: woman1.id,
      name: 'Maria Silva',
      phone: '11999999999',
      relation: 'Mãe',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log('  - 2 women users');
  console.log('  - 2 men users');
  console.log('  - 1 verification');
  console.log('  - 1 match');
  console.log('  - 2 messages');
  console.log('  - 1 emergency contact');
  console.log('\n🔑 Test credentials:');
  console.log('  Email: marina@teste.com | Password: senha123');
  console.log('  Email: carlos@teste.com | Password: senha123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

