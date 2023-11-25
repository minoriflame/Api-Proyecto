// create seed for database

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const prisma = new PrismaClient();

const dataUsuarios = [
  {
    email: 'juan@gmail.com',
    password: "123456",
  },
  {
    email: 'pedro@gmail.com',
    password: "123456",
  },
  {
    email: 'diego@diego.com',
    password: "123456",
  }
];

const dataRooms = [
  {
    nombre: 'Sala 1',
    capacidad: 10,
  },
  {
    nombre: 'Sala 2',
    capacidad: 20,
  },
  {
    nombre: 'Sala 3',
    capacidad: 30,
  },
  {
    nombre: 'Sala 4',
    capacidad: 40,
  },
];

const dataReserve = [
  {
    fechaInicio: new Date('2023-11-01T09:00:00'),
    fechaTermino: new Date('2023-11-02T10:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-03T10:00:00'),
    fechaTermino: new Date('2023-11-04T11:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-05T11:00:00'),
    fechaTermino: new Date('2023-11-06T12:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-07T12:00:00'),
    fechaTermino: new Date('2023-11-08T13:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-09T13:00:00'),
    fechaTermino: new Date('2023-11-10T14:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-11T14:00:00'),
    fechaTermino: new Date('2023-11-12T15:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-13T15:00:00'),
    fechaTermino: new Date('2023-11-14T16:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-15T16:00:00'),
    fechaTermino: new Date('2023-11-16T17:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-17T17:00:00'),
    fechaTermino: new Date('2023-11-18T18:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-19T18:00:00'),
    fechaTermino: new Date('2023-11-20T19:00:00'),
  },
  {
    fechaInicio: new Date('2023-11-21T19:00:00'),
    fechaTermino: new Date('2023-11-22T20:00:00'),
  }
];


async function seedSalas() {
  for (const sala of dataRooms) {
    await prisma.sala.create({
      data: sala,
    });
  }
}

async function seedUsuarios() {
  for (const usuario of dataUsuarios) {

    const { email, password } = usuario;

    const hash = bcrypt.hashSync(password, saltRounds);

    await prisma.usuario.create({
      data: {
        email: email,
        password: hash,
      },
    });
  }
}

async function seedReservas() {
  for (const reserva of dataReserve) {

    // get random sala
    const salas = await prisma.sala.findMany();
    const sala = salas[Math.floor(Math.random() * salas.length)];

    const usuarios = await prisma.usuario.findMany();
    const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];

    const reservaData = {
      ...reserva,
      sala: {
        connect: {
          codigo: sala.codigo,
        },
      },
      usuario: {
        connect: {
          id: usuario.id,
        },
      },
    };

    console.log(reservaData);

    await prisma.reserva.create({
      data: reservaData,
    });
  }
}

async function main() {
  await seedUsuarios();
  await seedSalas();
  await seedReservas();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});