
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../services/user');

const router = express.Router();

const MESSAGE_CREDENCIALES = 'Credenciales Incorrectas';

router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  // Validamos que el usuario y la contraseña no estén vacíos
  if (!email || !password) {
    return res.status(400).json({ message: 'email y password son requeridos' });
  }

  // Validamos que el usuario exista en la base de datos
  const usuario = await getUserByEmail(email);

  if (!usuario) {
    return res.status(401).json({ message: MESSAGE_CREDENCIALES });
  }

  // Validamos que la contraseña sea correcta
  const isValidPassword = await bcrypt.compareSync(password, usuario.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: MESSAGE_CREDENCIALES });
  }


  const token = jwt.sign(
    { usuario },
    process.env.TOKEN_JWT
  );

  // Devolvemos el token como respuesta
  return res.json({ token });
});

module.exports = router;
