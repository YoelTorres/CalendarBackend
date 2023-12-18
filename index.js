const express = require('express');
const { dbConnection } = require('./database');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT;

// * Base de datos
dbConnection();

// * CORS
app.use(cors());

// * Directorio Público
app.use(express.static('public'));

// * Lecturas y parseo del body
app.use(express.json());

// * RUTAS
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));