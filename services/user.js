const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUserById = async (userId) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;

  } catch (error) {
    throw new Error(error);
  }
}

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.usuario.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;

  } catch (error) {
    throw new Error(error);
  }
}

exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;