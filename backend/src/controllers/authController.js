import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both username and password.' });
    }

    const result = await query(
      `SELECT * FROM admins WHERE username = $1 OR email = $1 LIMIT 1;`,
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email },
      process.env.JWT_SECRET || 'shruti_portfolio_jwt_secret_key_2026_secure',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, username, email, created_at FROM admins WHERE id = $1;`,
      [req.admin.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    res.json({ success: true, admin: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateCredentials = async (req, res, next) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    const result = await query(`SELECT * FROM admins WHERE id = $1;`, [req.admin.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }
    const admin = result.rows[0];

    // If changing password, verify current password
    let passwordHash = admin.password_hash;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(newPassword, salt);
    }

    const updatedUsername = username ? username.trim() : admin.username;
    const updatedEmail = email ? email.trim() : admin.email;

    await query(
      `UPDATE admins SET username = $1, email = $2, password_hash = $3 WHERE id = $4;`,
      [updatedUsername, updatedEmail, passwordHash, req.admin.id]
    );

    res.json({
      success: true,
      message: 'Admin credentials updated successfully.',
      admin: { id: admin.id, username: updatedUsername, email: updatedEmail }
    });
  } catch (err) {
    next(err);
  }
};
