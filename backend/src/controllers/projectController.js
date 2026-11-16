import { query } from '../config/db.js';

export const getProjects = async (req, res, next) => {
  try {
    const result = await query(`SELECT * FROM projects ORDER BY display_order ASC, id ASC;`);
    res.json({ success: true, projects: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      technologies,
      image_url,
      github_url,
      live_demo_url,
      featured,
      display_order,
      project_type = 'personal',
      company_name
    } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }
    if (!['personal', 'company'].includes(project_type)) {
      return res.status(400).json({ success: false, message: 'Project type must be personal or company.' });
    }
    if (project_type === 'company' && !company_name?.trim()) {
      return res.status(400).json({ success: false, message: 'Company name is required for company projects.' });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? technologies.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const order = display_order !== undefined ? parseInt(display_order, 10) : 0;

    const result = await query(
      `INSERT INTO projects (title, description, technologies, image_url, github_url, live_demo_url, featured, display_order, project_type, company_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [
        title.trim(),
        description.trim(),
        JSON.stringify(techArray),
        image_url || '',
        github_url || '',
        live_demo_url || '',
        Boolean(featured),
        order,
        project_type,
        project_type === 'company' ? company_name.trim() : null
      ]
    );

    res.status(201).json({ success: true, message: 'Project created successfully.', project: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      technologies,
      image_url,
      github_url,
      live_demo_url,
      featured,
      display_order,
      project_type,
      company_name
    } = req.body;

    if (project_type !== undefined && !['personal', 'company'].includes(project_type)) {
      return res.status(400).json({ success: false, message: 'Project type must be personal or company.' });
    }
    if (project_type === 'company' && !company_name?.trim()) {
      return res.status(400).json({ success: false, message: 'Company name is required for company projects.' });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? technologies.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const result = await query(
      `UPDATE projects
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           technologies = COALESCE($3, technologies),
           image_url = COALESCE($4, image_url),
           github_url = COALESCE($5, github_url),
           live_demo_url = COALESCE($6, live_demo_url),
           featured = COALESCE($7, featured),
           display_order = COALESCE($8, display_order),
           project_type = COALESCE($9, project_type),
           company_name = CASE
             WHEN $9 = 'personal' THEN NULL
             ELSE COALESCE($10, company_name)
           END
       WHERE id = $11 RETURNING *;`,
      [
        title ? title.trim() : null,
        description ? description.trim() : null,
        techArray !== undefined ? JSON.stringify(techArray) : null,
        image_url !== undefined ? image_url : null,
        github_url !== undefined ? github_url : null,
        live_demo_url !== undefined ? live_demo_url : null,
        featured !== undefined ? Boolean(featured) : null,
        display_order !== undefined ? parseInt(display_order, 10) : null,
        project_type || null,
        company_name !== undefined ? company_name.trim() : null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.json({ success: true, message: 'Project updated successfully.', project: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM projects WHERE id = $1 RETURNING *;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const reorderProjects = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { id, display_order }
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid payload. Array of items expected.' });
    }

    for (const item of items) {
      await query(`UPDATE projects SET display_order = $1 WHERE id = $2;`, [item.display_order, item.id]);
    }

    res.json({ success: true, message: 'Project display order updated successfully.' });
  } catch (err) {
    next(err);
  }
};
