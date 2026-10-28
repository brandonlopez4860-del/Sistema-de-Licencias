const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AuthModel = require('../models/authModel');

const login = async (req, res) => {
    const { dni, password } = req.body;

    try {
        if (!dni || !password) {
            return res.status(400).json({ mensaje: 'Por favor, ingrese sus credenciales completas.' });
        }

        const user = await AuthModel.getUserByDni(dni);

        if (!user) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas (Usuario no encontrado)' });
        }

        // Comparamos la contraseña en texto plano o con hash bcrypt
        let passwordValida = (password === user.password_hash);
        if (!passwordValida && user.password_hash) {
            try {
                passwordValida = await bcrypt.compare(password, user.password_hash);
            } catch (err) {}
        }
        
        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas (Contraseña incorrecta)' });
        }

        // Firmamos el token con los datos que el frontend necesitará
        const token = jwt.sign(
            { 
                id: user.id_usuario, 
                rol: user.nombre_rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            mensaje: 'Bienvenido al sistema',
            token,
            usuario: {
                username: user.username,
                dni: user.dni,
                nombre: user.username,
                apellido: '',
                rol: user.nombre_rol,
                cod_rol: user.cod_rol
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = { login };