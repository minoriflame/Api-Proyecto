require('dotenv').config()
const express = require('express');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const V1SwaggerDocs = require('./routes/swagger');
const roomRoutes = require('./routes/roomRoutes');
const reserveRoutes = require('./routes/reserveRoutes');
const passportRoutes = require('./routes/passportRoutes');
const { getUserById } = require('./services/user');


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_JWT || 'secret', // Cambia esta clave secreta por una más segura
};

const app = express();
app.use(express.json());

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    console.log(payload.usuario);
    const user = await getUserById(payload.usuario.id);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);

app.use('/', passportRoutes);
app.use('/', passport.authenticate('jwt', { session: false }), roomRoutes);
app.use('/', passport.authenticate('jwt', { session: false }), reserveRoutes);

V1SwaggerDocs(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
