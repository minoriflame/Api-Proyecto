const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getRooms = async () => {
  try {
    return await prisma.sala.findMany({
      include: { reservas: true }, // Incluir reservas si es necesario
    });
  } catch (error) {
    throw new Error(error);
  }
}

const getRoomByCode = async (roomCode) => {
  // Manejar la ruta para obtener los datos de una sala por su código
  try {
    const room = await prisma.sala.findUnique({
      where: { codigo: roomCode },
      include: { reservas: true }, // Incluir reservas si es necesario
    });

    if (!room) {
      throw new Error('Sala no encontrada');
    }

    return room;
  } catch (error) {
    throw new Error(error);
  }
}

exports.getRooms = getRooms;
exports.getRoomByCode = getRoomByCode;