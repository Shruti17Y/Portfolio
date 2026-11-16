import { query } from '../config/db.js';

export const getSkills = async (req, res, next) => {
  try {
    const categoriesRes = await query(`SELECT * FROM skill_categories ORDER BY display_order ASC, id ASC;`);
    const skillsRes = await query(`SELECT * FROM skills ORDER BY display_order ASC, id ASC;`);

    const categoriesWithSkills = categoriesRes.rows.map((cat) => ({
      ...cat,
      skills: skillsRes.rows.filter((s) => s.category_id === cat.id)
    }));

    res.json({
      success: true,
      categories: categoriesWithSkills,
      allSkills: skillsRes.rows
    });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, display_order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }
    const order = display_order !== undefined ? parseInt(display_order, 10) : 0;
    const result = await query(
      `INSERT INTO skill_categories (name, display_order) VALUES ($1, $2) RETURNING *;`,
      [name.trim(), order]
    );
    res.status(201).json({ success: true, category: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, display_order } = req.body;
    const result = await query(
      `UPDATE skill_categories
       SET name = COALESCE($1, name),
           display_order = COALESCE($2, display_order)
       WHERE id = $3 RETURNING *;`,
      [name ? name.trim() : null, display_order !== undefined ? parseInt(display_order, 10) : null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, category: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM skill_categories WHERE id = $1 RETURNING *;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category and all associated skills deleted.' });
  } catch (err) {
    next(err);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const { name, category_id, icon_name, display_order } = req.body;
    if (!name || !category_id) {
      return res.status(400).json({ success: false, message: 'Skill name and category are required.' });
    }
    const order = display_order !== undefined ? parseInt(display_order, 10) : 0;
    const result = await query(
      `INSERT INTO skills (name, category_id, icon_name, display_order)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [name.trim(), parseInt(category_id, 10), icon_name ? icon_name.trim() : null, order]
    );
    res.status(201).json({ success: true, skill: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category_id, icon_name, display_order } = req.body;
    const result = await query(
      `UPDATE skills
       SET name = COALESCE($1, name),
           category_id = COALESCE($2, category_id),
           icon_name = COALESCE($3, icon_name),
           display_order = COALESCE($4, display_order)
       WHERE id = $5 RETURNING *;`,
      [
        name ? name.trim() : null,
        category_id ? parseInt(category_id, 10) : null,
        icon_name !== undefined ? icon_name : null,
        display_order !== undefined ? parseInt(display_order, 10) : null,
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }
    res.json({ success: true, skill: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM skills WHERE id = $1 RETURNING *;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }
    res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
