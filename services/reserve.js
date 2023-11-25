const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reserveCount = async (salaCodigo) => {
  try {
    return await prisma.reserva.count({
      where: {
        salaCodigo: salaCodigo,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}

const createReserve = async (usuario, salaCodigo, fechaInicio, fechaTermino) => {
  try {
    return await prisma.reserva.create({
      data: {
        usuario: { connect: { id: usuario } },
        fechaInicio,
        fechaTermino,
        sala: { connect: { codigo: salaCodigo } },
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}

const getReserves = async ({token, usuario, salaCodigo, fechaInicio, fechaTermino}) => {
  try {
    const where = {};

    if (token) {
      where.token = token;
    }
    if (usuario) {
      where.usuario = usuario;
    }
    if (salaCodigo) {
      where.salaCodigo = salaCodigo;
    }
    if (fechaInicio) {
      where.fechaInicio = fechaInicio;
    }
    if (fechaTermino) {
      where.fechaTermino = fechaTermino;
    }

    return await prisma.reserva.findMany({
      where,
      include: { sala: true }, // Incluir sala si es necesario
    });
  } catch (error) {
    throw new Error(error);
  }
}

const getReserveByCodeandDate = async (salaCodigo, dateFormatted) => {
  try {
    return await prisma.reserva.findMany({
      where: {
        sala: { codigo: salaCodigo },
        AND: [
          { fechaInicio: { lte: dateFormatted } }, // La fecha de inicio debe ser menor o igual a la fecha proporcionada
          { fechaTermino: { gte: dateFormatted } }, // La fecha de término debe ser mayor o igual a la fecha proporcionada
        ],
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}

const deleteReserve = async (token) => {
  try {
    return await prisma.reserva.delete({ where: { token } });
  } catch (error) {
    throw new Error(error);
  }
}

exports.reserveCount = reserveCount;
exports.createReserve = createReserve;
exports.getReserves = getReserves;
exports.getReserveByCodeandDate = getReserveByCodeandDate;
exports.deleteReserve = deleteReserve;