import { query } from '../config/db.js';

export const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide your name, email, and message.' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const result = await query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [name.trim(), email.trim(), subject ? subject.trim() : 'General Inquiry', message.trim()]
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const result = await query(`SELECT * FROM contact_messages ORDER BY created_at DESC;`);
    res.json({ success: true, messages: result.rows });
  } catch (err) {
    next(err);
  }
};

export const toggleRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    const result = await query(
      `UPDATE contact_messages
       SET is_read = COALESCE($1, NOT is_read)
       WHERE id = $2 RETURNING *;`,
      [is_read !== undefined ? Boolean(is_read) : null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    res.json({
      success: true,
      message: 'Message status updated.',
      messageItem: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM contact_messages WHERE id = $1 RETURNING *;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
