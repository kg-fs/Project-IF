
import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { generateUniqueUserId } from '../utils/UserId.js';
import jwt from 'jsonwebtoken';

// controlador para insertar un nuevo usuario

export const insertUser = async (req, res) => {
  try {
    const Num_user = await generateUniqueUserId();
    const {
      First_name_user,
      Last_name_user,
      Email,
      Password_user,
      Num_rol,
      Num_cat_state
    } = req.body;

    if (!Num_user || !First_name_user || !Last_name_user || !Email || !Password_user || !Num_rol || !Num_cat_state) {
      return res.status(400).json({ message: 'Faltan datos requeridos.' });
    }

    const hashedPassword = await bcrypt.hash(Password_user, 10);
    console.log("Hash generado:", hashedPassword);
    console.log("Longitud del hash:", hashedPassword.length);

    const [rows] = await pool.query(
      'CALL InsertUser(?, ?, ?, ?, ?, ?, ?)',
      [
        Num_user,
        First_name_user,
        Last_name_user,
        Email,
        hashedPassword,
        Num_rol,
        Num_cat_state
      ]
    );

    const result = rows[0][0];

    if (result.success === 1) {
      res.status(201).json({ message: result.message, success: true });
    } else {
      res.status(400).json({ message: result.message, success: false });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// controlador para loguearse
export const loginUser = async (req, res) => {
  try {
    const { Email, Password_user } = req.body;

    if (!Email || !Password_user) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [rows] = await pool.query("CALL GetPasswordByEmail(?)", [Email]);
    const user = rows[0][0];

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("Contraseña enviada:", Password_user);
    console.log("Hash BD original:", user.Password_user);
    console.log("Longitud hash BD:", user.Password_user.length);

    const isMatch = await bcrypt.compare(Password_user, user.Password_user);

    console.log("Resultado bcrypt.compare:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        Num_user: user.Num_user,
        Email: user.Email,
        First_name_user: user.First_name_user,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Establecer el JWT como cookie (ajustada para CORS con credenciales)
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProd, // en localhost (dev) debe ser false; en prod true (HTTPS)
      sameSite: isProd ? 'strict' : 'none', // para cross-site en dev usar 'none'
      maxAge: 3600000,
    });

    // Enviar respuesta JSON sin el token
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        Num_user: user.Num_user,
        First_name_user: user.First_name_user,
        Last_name_user: user.Last_name_user,
        Email: user.Email,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};