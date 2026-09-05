const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const newPassword = 'pdhfinace10832';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  console.log('Updating password for admin...');
  const updatedUser = await prisma.user.update({
    where: { username: 'admin' },
    data: {
      passwordHash,
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  console.log(`✓ Successfully updated admin user: ${updatedUser.username}`);
  console.log(`  Password set to: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error('Error updating admin password:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
