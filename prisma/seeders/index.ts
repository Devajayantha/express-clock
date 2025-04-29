import { config } from '../../src/configs/config';
import userSeeder from "./user.seeder";

const prisma = config.prisma.getClient();

async function main() {
  console.log('Seeding started...');

  await userSeeder();

  console.log('Seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })