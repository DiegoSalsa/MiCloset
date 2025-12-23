const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { validateEmail, validatePassword, validateUsername, validateGender } = require('../utils/validators');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, gender, fullName } = req.body;

    // Validaciones
    if (!email || !password || !username || !gender) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({ error: 'El nombre de usuario debe tener 3-50 caracteres (letras, números, guiones bajos)' });
    }

    if (!validateGender(gender)) {
      return res.status(400).json({ error: 'Género inválido' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'El email o nombre de usuario ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, username, gender, full_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, gender, full_name, created_at`,
      [email, hashedPassword, username, gender.toLowerCase(), fullName || username]
    );

    const user = result.rows[0];

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '✅ Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        fullName: user.full_name
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Crear token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '✅ Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        fullName: user.full_name,
        profilePicture: user.profile_picture_url
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// OBTENER PERFIL DEL USUARIO
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, gender, full_name, profile_picture_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      gender: user.gender,
      fullName: user.full_name,
      profilePicture: user.profile_picture_url,
      createdAt: user.created_at
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// ACTUALIZAR PERFIL
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, profilePicture } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name), 
           profile_picture_url = COALESCE($2, profile_picture_url)
       WHERE id = $3
       RETURNING id, username, email, gender, full_name, profile_picture_url`,
      [fullName || null, profilePicture || null, req.user.id]
    );

    const user = result.rows[0];

    res.json({
      message: '✅ Perfil actualizado',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        fullName: user.full_name,
        profilePicture: user.profile_picture_url
      }
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

module.exports = router;
