import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST || '127.0.0.1',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'portfolio_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const query = (text, params) => pool.query(text, params);

export const initDB = async () => {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL successfully.');

    // 1. admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255) NOT NULL,
        introduction TEXT NOT NULL,
        about_me TEXT NOT NULL,
        profile_image VARCHAR(500),
        email VARCHAR(255),
        linkedin_url VARCHAR(500),
        github_url VARCHAR(500),
        resume_url VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. skill_categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skill_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        display_order INTEGER DEFAULT 0
      );
    `);

    // 4. skills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category_id INTEGER REFERENCES skill_categories(id) ON DELETE CASCADE,
        icon_name VARCHAR(100),
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. experiences table
    await client.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        designation VARCHAR(255) NOT NULL,
        duration VARCHAR(100) NOT NULL,
        responsibilities JSONB NOT NULL DEFAULT '[]',
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        technologies JSONB NOT NULL DEFAULT '[]',
        image_url VARCHAR(500),
        github_url VARCHAR(500),
        live_demo_url VARCHAR(500),
        featured BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS project_type VARCHAR(20) NOT NULL DEFAULT 'personal',
      ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
    `);

    // 7. education table
    await client.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        degree VARCHAR(255) NOT NULL,
        institute_name VARCHAR(255) NOT NULL,
        duration VARCHAR(100),
        academic_results VARCHAR(255) NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. contact_messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. website_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS website_settings (
        id SERIAL PRIMARY KEY,
        site_title VARCHAR(255) DEFAULT 'Shruti Patel | Full Stack Developer',
        logo_text VARCHAR(100) DEFAULT 'Shruti Patel',
        footer_text VARCHAR(255) DEFAULT '© 2026 Shruti Patel. All rights reserved.',
        github_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        email VARCHAR(255),
        resume_url VARCHAR(500),
        sections_enabled JSONB DEFAULT '{"about":true,"experience":true,"skills":true,"projects":true,"education":true,"contact":true}',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('PostgreSQL database tables verified and ready.');
  } finally {
    client.release();
  }
};

export default pool;
