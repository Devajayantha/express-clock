import { config } from '../../src/configs/config';
import userSeeder from "./user.seeder";

async function main() {
  console.log('Seeding started...');

  await userSeeder();

  console.log('Seeding completed!');
}

main()
  .then(async () => {
    await config.prisma.getClient().$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    await config.prisma.getClient().$disconnect()
    process.exit(1)
  })