import { query } from '../config/db.js';

export const getProfile = async (req, res, next) => {
  try {
    const result = await query(`SELECT * FROM profiles ORDER BY id ASC LIMIT 1;`);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    res.json({ success: true, profile: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      designation,
      introduction,
      about_me,
      email,
      linkedin_url,
      github_url,
      profile_image,
      resume_url
    } = req.body;

    const existing = await query(`SELECT id FROM profiles ORDER BY id ASC LIMIT 1;`);
    let result;

    if (existing.rows.length === 0) {
      result = await query(
        `INSERT INTO profiles (name, designation, introduction, about_me, email, linkedin_url, github_url, profile_image, resume_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
        [name, designation, introduction, about_me, email, linkedin_url, github_url, profile_image, resume_url]
      );
    } else {
      const id = existing.rows[0].id;
      result = await query(
        `UPDATE profiles
         SET name = COALESCE($1, name),
             designation = COALESCE($2, designation),
             introduction = COALESCE($3, introduction),
             about_me = COALESCE($4, about_me),
             email = COALESCE($5, email),
             linkedin_url = COALESCE($6, linkedin_url),
             github_url = COALESCE($7, github_url),
             profile_image = COALESCE($8, profile_image),
             resume_url = COALESCE($9, resume_url),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $10 RETURNING *;`,
        [name, designation, introduction, about_me, email, linkedin_url, github_url, profile_image, resume_url, id]
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};
