import bcrypt from 'bcrypt';
import prisma from '../client';

async function userSeeder() {
  const password = await bcrypt.hash('password', 10);

  console.log('Seeding users...');

  await prisma.user.createMany({
    data:[
      {
        email: 'johndoe@gmail.com',
        name: 'John Doe',
        password: password
      },
      {
        email: 'devajayantha@gmail.com',
        name: 'Deva Jayantha',
        password: password
      }
    ]
  });

  console.log('Users seeded!');
}

export default userSeeder;