const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inicializar la conexión a la base de datos
require('./config/db'); 

const app = express();

// Middlewares obligatorios
app.use(cors()); // Permite que tu frontend se conecte sin bloqueos
app.use(express.json()); // Permite recibir datos en formato JSON desde React

// Ruta de prueba para verificar que el backend responde
app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', database: 'Conectada' });
});

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/escalafon', require('./routes/escalafonRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/instituciones', require('./routes/institucionRoutes'));
app.use('/api/trabajadores', require('./routes/trabajadorRoutes'));
app.use('/api/remuneracion', require('./routes/remuneracionRoutes'));
// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});