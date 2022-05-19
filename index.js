const express = require('express');
require('dotenv').config();
const cors = require('cors')


// Crear el servidor de express
const app = express();

//Cors
app.use(cors());

// Directorio Publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/files', require('./routes/files'))
//CRUD EVENTOS

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});

module.exports = {
    validateServerRun: function (message = `Servidor corriendo en puerto ${process.env.PORT}`) {
        return message
    }
}