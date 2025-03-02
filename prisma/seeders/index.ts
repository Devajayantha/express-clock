import prisma from '../../src/configs/prisma.config';
import userSeeder from "./user.seeder";

async function main() {
  console.log('Seeding started...');

  await userSeeder();

  console.log('Seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })