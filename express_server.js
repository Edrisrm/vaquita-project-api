const express = require('express');
const { dbConnection } = require('./database/config');

require('dotenv').config();

const cors = require('cors');

const app = express();

dbConnection();

app.use(cors())

app.use( express.static('public'));

app.use ( express.json() );

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/inventory'));
app.use('/api', require('./routes/apart'));

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto: ${ process.env.PORT }`);
});

module.exports = app;