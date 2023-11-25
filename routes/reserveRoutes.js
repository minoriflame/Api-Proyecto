const express = require('express');
const {
  reserveCount,
  createReserve,
  getReserves,
  getReserveByCodeandDate,
  deleteReserve
} = require('../services/reserve');
const {
  getRooms,
  getRoomByCode
} = require('../services/rooms');
const {
  getUserById
} = require('../services/user');

const router = express.Router();


/**
 * @openapi
 * /v1/reserve/request:
 *   post:
 *     summary: Crea una reserva.
 *     description: Endpoint para crear una nueva reserva.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               salaCodigo:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaTermino:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - usuario
 *               - salaCodigo
 *               - fechaInicio
 *               - fechaTermino
 *     responses:
 *       '200':
 *         description: OK. Retorna la reserva creada.
 *       '400':
 *         description: Faltan parámetros o capacidad de la sala excedida.
 *       '404':
 *         description: Sala o usuario no encontrados.
 *       '500':
 *         description: Error al crear la reserva.
 */
router.post('/v1/reserve/request', async (req, res) => {
  // Crear una reserva
  const { usuario, salaCodigo, fechaInicio, fechaTermino } = req.body; // Asegúrate de validar y desestructurar los datos correctamente
  try {
    if (!usuario || !salaCodigo || !fechaInicio || !fechaTermino) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }

    const sala = await getRoomByCode(salaCodigo);
    await getUserById(usuario);

    const reservaExistente =  await reserveCount(salaCodigo);

    // Verificar la capacidad de la sala
    if (reservaExistente >= sala.capacidad) {
      return res.status(400).json({ error: 'Capacidad de la sala excedida' });
    }

    const reserva = await createReserve(usuario, salaCodigo, fechaInicio, fechaTermino);

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva', error });
  }
});

/**
 * @openapi
 * /v1/reserve/search:
 *   post:
 *     summary: Busca reservas basadas en parámetros.
 *     description: Endpoint para buscar reservas según diferentes parámetros.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               usuario:
 *                 type: string
 *               salaCodigo:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaTermino:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       '200':
 *         description: OK. Retorna las reservas encontradas.
 *       '500':
 *         description: Error al buscar reservas.
 */
router.post('/v1/reserve/search', async (req, res) => {
  // Buscar reservas basadas en parámetros
  const { token, usuario, salaCodigo, fechaInicio, fechaTermino } = req.body; // Define tus propios parámetros de búsqueda
  try {

    const reservas = await getReserves({ token, usuario, salaCodigo, fechaInicio, fechaTermino });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar reservas' });
  }
});

/**
 * @openapi
 * /v1/reserve/schedule/:
 *   get:
 *     summary: Obtiene agenda para una sala y fecha dada.
 *     description: Endpoint para obtener la agenda de una sala en una fecha específica.
 *     parameters:
 *       - in: query
 *         name: salaCodigo
 *         required: true
 *         description: Código de la sala.
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         description: Fecha en formato ISO 8601 (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       '200':
 *         description: OK. Retorna la agenda para la sala y fecha especificadas.
 *       '500':
 *         description: Error al obtener la agenda.
 */
router.get('/v1/reserve/schedule/', async (req, res) => {
  // Obtener agenda para una sala y fecha dada
  const { salaCodigo, date } = req.body;
  const dateFormatted = new Date(date);

  try {
    // Consulta las reservas para la sala y fecha especificadas
    const agenda = await getReserveByCodeandDate(salaCodigo, dateFormatted);
    res.json(agenda);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la agenda' });
  }
});

/**
 * @openapi
 * /v1/reserve/{token}/cancel:
 *   delete:
 *     summary: Anula una reserva.
 *     description: Endpoint para anular una reserva usando su token.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de la reserva a anular.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Retorna la reserva anulada.
 *       '500':
 *         description: Error al anular la reserva.
 */
router.delete('/v1/reserve/:token/cancel', async (req, res) => {
  // Anular una reserva
  const { token } = req.params;
  try {
    const deletedReserva = await deleteReserve(token);
    res.json(deletedReserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al anular la reserva' });
  }
});

module.exports = router;