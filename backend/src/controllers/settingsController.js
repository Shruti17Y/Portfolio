import { query } from '../config/db.js';

export const getSettings = async (req, res, next) => {
  try {
    const result = await query(`SELECT * FROM website_settings ORDER BY id ASC LIMIT 1;`);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Settings not found.' });
    }
    res.json({ success: true, settings: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const {
      site_title,
      logo_text,
      footer_text,
      github_url,
      linkedin_url,
      email,
      resume_url,
      sections_enabled
    } = req.body;

    const existing = await query(`SELECT id FROM website_settings ORDER BY id ASC LIMIT 1;`);
    let result;

    const sectionsJson = sections_enabled !== undefined
      ? (typeof sections_enabled === 'string' ? sections_enabled : JSON.stringify(sections_enabled))
      : null;

    if (existing.rows.length === 0) {
      result = await query(
        `INSERT INTO website_settings (site_title, logo_text, footer_text, github_url, linkedin_url, email, resume_url, sections_enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
        [site_title, logo_text, footer_text, github_url, linkedin_url, email, resume_url, sectionsJson]
      );
    } else {
      const id = existing.rows[0].id;
      result = await query(
        `UPDATE website_settings
         SET site_title = COALESCE($1, site_title),
             logo_text = COALESCE($2, logo_text),
             footer_text = COALESCE($3, footer_text),
             github_url = COALESCE($4, github_url),
             linkedin_url = COALESCE($5, linkedin_url),
             email = COALESCE($6, email),
             resume_url = COALESCE($7, resume_url),
             sections_enabled = COALESCE($8, sections_enabled),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9 RETURNING *;`,
        [site_title, logo_text, footer_text, github_url, linkedin_url, email, resume_url, sectionsJson, id]
      );
    }

    res.json({
      success: true,
      message: 'Website settings updated successfully.',
      settings: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};
