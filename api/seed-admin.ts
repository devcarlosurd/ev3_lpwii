import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { hashPassword } from './auth/password';
import { databaseOptions } from './database';
import { Role, User } from './entities';

async function createAdmin() {
  const password = process.env.DEMO_PASSWORD;
  if (!password || password.length < 8) throw new Error('Completa DEMO_PASSWORD en tu archivo .env.');
  const database = await new DataSource(databaseOptions()).initialize();
  try {
    const users = database.getRepository(User);
    const correo = 'admin@gamehub.example';
    const current = await users.findOneBy({ correo });
    if (current && (current.rol !== Role.Admin || !current.activo)) {
      throw new Error('Este correo de demostración ya está ocupado.');
    }
    if (!current) {
      await users.save(users.create({ correo, nombre: 'Demo Admin', alias: 'admin', rol: Role.Admin, password: await hashPassword(password) }));
    }
    console.log('Cuenta de demostración disponible: ' + correo);
  } finally {
    await database.destroy();
  }
}

void createAdmin().catch(error => { console.error(error.message); process.exitCode = 1; });
