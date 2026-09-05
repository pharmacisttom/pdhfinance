const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminLogin() {
  console.log('Testing Admin login with username: admin...');

  const user = await prisma.user.findUnique({
    where: { username: 'admin' },
    include: { role: true },
  });

  if (!user) {
    console.error('❌ Admin user not found in MySQL database!');
    process.exit(1);
  }

  console.log(`✓ Found user in MySQL: ${user.username} (${user.fullName})`);
  console.log(`  Role: ${user.role.code} (${user.role.name})`);
  console.log(`  Email: ${user.email}`);

  const match1 = await bcrypt.compare('pdhfinance10832', user.passwordHash);
  console.log(`✓ Password "pdhfinance10832": ${match1 ? 'SUCCESS (MATCH)' : 'NO MATCH'}`);

  const match2 = await bcrypt.compare('pdhfinace10832', user.passwordHash);
  console.log(`✓ Password "pdhfinace10832": ${match2 ? 'SUCCESS (MATCH)' : 'NO MATCH'}`);
}

testAdminLogin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
