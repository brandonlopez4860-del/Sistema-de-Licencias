const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener usuarios' });
    }
};

const getProfile = async (req, res) => {
    try {
        const { dni } = req.params;
        const profile = await UserModel.getProfileByDni(dni);
        if (!profile) return res.status(404).json({ mensaje: 'Perfil no encontrado' });
        res.json(profile);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { dni } = req.params;
        await UserModel.updateProfileByDni(dni, req.body);
        res.json({ mensaje: 'Perfil actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { dni } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Validar que se pasaron las contraseñas
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        const currentHash = await UserModel.getPasswordHashByDni(dni);
        if (!currentHash) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Comparar contraseña actual
        const isMatch = await bcrypt.compare(currentPassword, currentHash);
        if (!isMatch) {
            return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
        }

        // Encriptar y guardar nueva contraseña
        const newHash = await bcrypt.hash(newPassword, 10);
        await UserModel.updatePasswordByDni(dni, newHash);
        
        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = { getUsers, getProfile, updateProfile, updatePassword };
