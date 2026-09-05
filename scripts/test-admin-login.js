const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminLogin() {
  console.log('Testing Admin login with username: admin, password: pdhfinace10832...');

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

  const match = await bcrypt.compare('pdhfinace10832', user.passwordHash);
  if (match) {
    console.log('✓ Password verification SUCCESSFUL: "pdhfinace10832" matches stored bcrypt hash!');
  } else {
    console.error('❌ Password verification FAILED!');
    process.exit(1);
  }
}

testAdminLogin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
