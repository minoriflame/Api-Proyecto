const express = require('express');
const {
  getRooms,
  getRoomByCode
} = require('../services/rooms');

const router = express.Router();

/**
 * @openapi
 * /v1/rooms:
 *   get:
 *     summary: Obtiene todas las salas.
 *     description: Endpoint para obtener todas las salas de la base de datos.
 *     responses:
 *       '200':
 *         description: OK. Retorna todas las salas con sus reservas.
 *       '500':
 *         description: Error al obtener las salas.
 *
 *
 */
router.get('/v1/rooms', async (req, res) => {
  try {
    const rooms = await getRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las salas', error });
  }
});

/**
 * @openapi
 * /v1/rooms/{roomCode}:
 *   get:
 *     summary: Obtiene los datos de una sala por su código.
 *     description: Endpoint para obtener los datos de una sala usando su código.
 *     parameters:
 *       - in: path
 *         name: roomCode
 *         required: true
 *         description: Código de la sala.
 *         schema:
 *           Sala:
 *            type: string
 *           example: 101
 *     responses:
 *       '200':
 *         description: OK. Retorna los datos de la sala con el código especificado.
 *       '404':
 *         description: Sala no encontrada.
 *       '500':
 *         description: Error al obtener la sala.
 */
router.get('/v1/rooms/:roomCode', async (req, res) => {
  const { roomCode } = req.params;
  try {
    const room = await getRoomByCode(roomCode);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la sala' });
  }
});

module.exports = router;
