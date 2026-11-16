import { query } from '../config/db.js';

export const getExperiences = async (req, res, next) => {
  try {
    const result = await query(`SELECT * FROM experiences ORDER BY display_order ASC, id ASC;`);
    res.json({ success: true, experiences: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createExperience = async (req, res, next) => {
  try {
    const { company_name, designation, duration, responsibilities, display_order } = req.body;
    if (!company_name || !designation || !duration) {
      return res.status(400).json({ success: false, message: 'Company name, designation, and duration are required.' });
    }

    const respArray = Array.isArray(responsibilities)
      ? responsibilities
      : typeof responsibilities === 'string'
      ? responsibilities.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    const order = display_order !== undefined ? parseInt(display_order, 10) : 0;

    const result = await query(
      `INSERT INTO experiences (company_name, designation, duration, responsibilities, display_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [company_name.trim(), designation.trim(), duration.trim(), JSON.stringify(respArray), order]
    );

    res.status(201).json({
      success: true,
      message: 'Experience entry created successfully.',
      experience: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company_name, designation, duration, responsibilities, display_order } = req.body;

    const respArray = Array.isArray(responsibilities)
      ? responsibilities
      : typeof responsibilities === 'string'
      ? responsibilities.split('\n').map(s => s.trim()).filter(Boolean)
      : undefined;

    const result = await query(
      `UPDATE experiences
       SET company_name = COALESCE($1, company_name),
           designation = COALESCE($2, designation),
           duration = COALESCE($3, duration),
           responsibilities = COALESCE($4, responsibilities),
           display_order = COALESCE($5, display_order)
       WHERE id = $6 RETURNING *;`,
      [
        company_name ? company_name.trim() : null,
        designation ? designation.trim() : null,
        duration ? duration.trim() : null,
        respArray !== undefined ? JSON.stringify(respArray) : null,
        display_order !== undefined ? parseInt(display_order, 10) : null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Experience entry not found.' });
    }

    res.json({
      success: true,
      message: 'Experience updated successfully.',
      experience: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM experiences WHERE id = $1 RETURNING *;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Experience entry not found.' });
    }
    res.json({ success: true, message: 'Experience deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const reorderExperiences = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { id, display_order }
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid payload. Array of items expected.' });
    }

    for (const item of items) {
      await query(`UPDATE experiences SET display_order = $1 WHERE id = $2;`, [item.display_order, item.id]);
    }

    res.json({ success: true, message: 'Experience display order updated successfully.' });
  } catch (err) {
    next(err);
  }
};
