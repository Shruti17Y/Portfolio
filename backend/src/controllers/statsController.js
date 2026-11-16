import { query } from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      projectsCount,
      skillsCount,
      expCount,
      eduCount,
      msgCount,
      unreadMsgCount,
      recentMessages,
      recentProjects
    ] = await Promise.all([
      query(`SELECT COUNT(*)::int as count FROM projects;`),
      query(`SELECT COUNT(*)::int as count FROM skills;`),
      query(`SELECT COUNT(*)::int as count FROM experiences;`),
      query(`SELECT COUNT(*)::int as count FROM education;`),
      query(`SELECT COUNT(*)::int as count FROM contact_messages;`),
      query(`SELECT COUNT(*)::int as count FROM contact_messages WHERE is_read = false;`),
      query(`SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5;`),
      query(`SELECT * FROM projects ORDER BY display_order ASC, id ASC LIMIT 4;`)
    ]);

    res.json({
      success: true,
      stats: {
        totalProjects: projectsCount.rows[0].count,
        totalSkills: skillsCount.rows[0].count,
        totalExperiences: expCount.rows[0].count,
        totalEducation: eduCount.rows[0].count,
        totalMessages: msgCount.rows[0].count,
        unreadMessages: unreadMsgCount.rows[0].count
      },
      recentMessages: recentMessages.rows,
      recentProjects: recentProjects.rows
    });
  } catch (err) {
    next(err);
  }
};
