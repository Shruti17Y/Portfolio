import { query } from '../config/db.js';

export const getEducation = async (req, res, next) => {
  try {
    const result = await query(`SELECT * FROM education ORDER BY display_order ASC, id ASC;`);
    res.json({ success: true, education: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createEducation = async (req, res, next) => {
  try {
    const { degree, institute_name, duration, academic_results, display_order } = req.body;
    if (!degree || !institute_name || !academic_results) {
      return res.status(400).json({ success: false, message: 'Degree, institute name, and academic results are required.' });
    }

    const order = display_order !== undefined ? parseInt(display_order, 10) : 0;

    const result = await query(
      `INSERT INTO education (degree, institute_name, duration, academic_results, display_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [degree.trim(), institute_name.trim(), duration ? duration.trim() : '', academic_results.trim(), order]
    );

    res.status(201).json({ success: true, message: 'Education created successfully.', education: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { degree, institute_name, duration, academic_results, display_order } = req.body;

    const result = await query(
      `UPDATE education
       SET degree = COALESCE($1, degree),
           institute_name = COALESCE($2, institute_name),
           duration = COALESCE($3, duration),
           academic_results = COALESCE($4, academic_results),
           display_order = COALESCE($5, display_order)
       WHERE id = $6 RETURNING *;`,
      [
        degree ? degree.trim() : null,
        institute_name ? institute_name.trim() : null,
        duration !== undefined ? duration.trim() : null,
        academic_results ? academic_results.trim() : null,
        display_order !== undefined ? parseInt(display_order, 10) : null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Education record not found.' });
    }

    res.json({ success: true, message: 'Education updated successfully.', education: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM education WHERE id = $1 RETURNING *;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Education record not found.' });
    }
    res.json({ success: true, message: 'Education record deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const reorderEducation = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid payload. Array of items expected.' });
    }

    for (const item of items) {
      await query(`UPDATE education SET display_order = $1 WHERE id = $2;`, [item.display_order, item.id]);
    }

    res.json({ success: true, message: 'Education display order updated successfully.' });
  } catch (err) {
    next(err);
  }
};
