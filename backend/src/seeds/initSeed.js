import bcrypt from 'bcryptjs';
import { query, initDB } from '../config/db.js';

export const seedData = async () => {
  await initDB();

  // 1. Check & seed Admin
  const adminRes = await query('SELECT id FROM admins LIMIT 1;');
  if (adminRes.rows.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);
    await query(
      `INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3);`,
      ['admin', 'admin@shruti.dev', passwordHash]
    );
    console.log('Seeded default admin (Username: admin, Password: Admin@123)');
  }

  // 2. Check & seed Profile
  const profileRes = await query('SELECT id FROM profiles LIMIT 1;');
  if (profileRes.rows.length === 0) {
    await query(
      `INSERT INTO profiles (name, designation, introduction, about_me, email, linkedin_url, github_url, resume_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        'Shruti Patel',
        'Full Stack Developer',
        'I am a Full Stack Developer passionate about building scalable, responsive, and user-friendly web applications. I enjoy working across frontend and backend technologies, developing REST APIs, managing databases, and solving real-world problems through technology.',
        'I am a Full Stack Developer with hands-on experience in developing and maintaining real-world web applications. I work with React.js, JavaScript, Node.js, Express.js, Python, Django, PostgreSQL, and MongoDB. I have experience building REST APIs, implementing authentication and role-based access control, integrating payment gateways, and working with production applications.',
        'shrutipatel.dev@gmail.com',
        'https://linkedin.com/in/shruti-patel',
        'https://github.com/shrutipatel',
        '/uploads/shruti_patel_resume.pdf'
      ]
    );
    console.log('Seeded default profile for Shruti Patel.');
  }

  // 3. Check & seed Skill Categories and Skills
  const catRes = await query('SELECT id FROM skill_categories LIMIT 1;');
  if (catRes.rows.length === 0) {
    const categories = [
      {
        name: 'Frontend',
        order: 1,
        skills: ['React.js', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS']
      },
      {
        name: 'Backend',
        order: 2,
        skills: ['Node.js', 'Express.js', 'Python', 'Django', 'REST APIs']
      },
      {
        name: 'Database',
        order: 3,
        skills: ['PostgreSQL', 'MongoDB', 'IndexedDB']
      },
      {
        name: 'Tools & Technologies',
        order: 4,
        skills: ['Git', 'GitHub', 'Postman', 'VS Code', 'JWT Authentication', 'Role-Based Access Control']
      }
    ];

    for (const cat of categories) {
      const insCat = await query(
        `INSERT INTO skill_categories (name, display_order) VALUES ($1, $2) RETURNING id;`,
        [cat.name, cat.order]
      );
      const catId = insCat.rows[0].id;

      for (let i = 0; i < cat.skills.length; i++) {
        await query(
          `INSERT INTO skills (name, category_id, display_order) VALUES ($1, $2, $3);`,
          [cat.skills[i], catId, i + 1]
        );
      }
    }
    console.log('Seeded skill categories and technical skills.');
  }

  // 4. Check & seed Experiences
  const expRes = await query('SELECT id FROM experiences LIMIT 1;');
  if (expRes.rows.length === 0) {
    const experiences = [
      {
        company_name: 'KONCPT AI',
        designation: 'Full Stack Developer',
        duration: 'Dec 2023 - Present',
        display_order: 1,
        responsibilities: [
          'Developed and maintained full-stack web applications using React.js, JavaScript, Node.js, Express.js, Python, and Django.',
          'Built and integrated REST APIs, PostgreSQL and MongoDB databases.',
          'Implemented authentication, role-based access control, and backend functionality.',
          'Worked on CRM, NGO management, society management, and property management applications.',
          'Integrated payment gateway functionality and handled production-level fixes.',
          'Participated in client demonstrations and application development workflows.'
        ]
      },
      {
        company_name: 'Petpooja',
        designation: 'Software Developer Intern',
        duration: 'May 2023 - Nov 2023',
        display_order: 2,
        responsibilities: [
          'Worked on a desktop POS application using React.js, JavaScript, Tauri, and Rust.',
          'Implemented billing features, including discounts, promotions, split payments, and part payments.',
          'Worked on online/offline POS functionality using IndexedDB.',
          'Implemented multilingual support for four regional languages.',
          'Developed Sales Return functionality.',
          'Contributed to improving checkout workflows.'
        ]
      }
    ];

    for (const exp of experiences) {
      await query(
        `INSERT INTO experiences (company_name, designation, duration, responsibilities, display_order)
         VALUES ($1, $2, $3, $4, $5);`,
        [exp.company_name, exp.designation, exp.duration, JSON.stringify(exp.responsibilities), exp.display_order]
      );
    }
    console.log('Seeded experience entries.');
  }

  // 5. Check & seed Projects
  const projRes = await query('SELECT id FROM projects LIMIT 1;');
  if (projRes.rows.length === 0) {
    const projects = [
      {
        title: 'Freedom Foundation',
        description: 'Comprehensive NGO management platform supporting donor tracking, multi-tier campaigns, beneficiary allocations, donation reporting, and full Razorpay payment gateway integration.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Razorpay'],
        image_url: '',
        github_url: 'https://github.com/shrutipatel/freedom-foundation',
        live_demo_url: '',
        featured: true,
        display_order: 1
      },
      {
        title: 'GateKeep',
        description: 'Advanced society management system featuring role-specific portals for residents, security personnel, and admin. Includes visitor pass verification, amenities reservations, staff attendance, and digital helpdesk ticketing.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'REST APIs'],
        image_url: '',
        github_url: 'https://github.com/shrutipatel/gatekeep',
        live_demo_url: '',
        featured: true,
        display_order: 2
      },
      {
        title: 'LeadNxt CRM',
        description: 'High-speed customer relationship management system tailored for lead lifecycle tracking, contact history, pipeline stage velocity, and team collaboration.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL'],
        image_url: '',
        github_url: 'https://github.com/shrutipatel/leadnxt-crm',
        live_demo_url: '',
        featured: true,
        display_order: 3
      },
      {
        title: 'PropSpy',
        description: 'Multi-portal real estate and property intelligence platform serving buyers, agents, institutional investors, and property owners with dynamic analytics and listing intelligence.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Django'],
        image_url: '',
        github_url: 'https://github.com/shrutipatel/propspy',
        live_demo_url: '',
        featured: true,
        display_order: 4
      }
    ];

    for (const proj of projects) {
      await query(
        `INSERT INTO projects (title, description, technologies, image_url, github_url, live_demo_url, featured, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          proj.title,
          proj.description,
          JSON.stringify(proj.technologies),
          proj.image_url,
          proj.github_url,
          proj.live_demo_url,
          proj.featured,
          proj.display_order
        ]
      );
    }
    console.log('Seeded projects.');
  }

  // 6. Check & seed Education
  const eduRes = await query('SELECT id FROM education LIMIT 1;');
  if (eduRes.rows.length === 0) {
    const education = [
      {
        degree: 'B.Tech in Computer Science / Information Technology',
        institute_name: 'LJ Institute of Engineering and Technology',
        duration: '2023 - 2027',
        academic_results: 'Semester 3 SPI: 8.46 / 10',
        display_order: 1
      },
      {
        degree: 'Higher Secondary Certificate (HSC)',
        institute_name: 'GSEB',
        duration: '2023',
        academic_results: '74.09 Percentile',
        display_order: 2
      },
      {
        degree: 'Secondary School Certificate (SSC)',
        institute_name: 'GSEB',
        duration: '2021',
        academic_results: '98.91 Percentile',
        display_order: 3
      }
    ];

    for (const edu of education) {
      await query(
        `INSERT INTO education (degree, institute_name, duration, academic_results, display_order)
         VALUES ($1, $2, $3, $4, $5);`,
        [edu.degree, edu.institute_name, edu.duration, edu.academic_results, edu.display_order]
      );
    }
    console.log('Seeded education.');
  }

  // 7. Check & seed Website Settings
  const setRes = await query('SELECT id FROM website_settings LIMIT 1;');
  if (setRes.rows.length === 0) {
    await query(
      `INSERT INTO website_settings (site_title, logo_text, footer_text, github_url, linkedin_url, email, resume_url, sections_enabled)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        'Shruti Patel | Full Stack Developer',
        'Shruti Patel',
        '© 2026 Shruti Patel. All rights reserved.',
        'https://github.com/shrutipatel',
        'https://linkedin.com/in/shruti-patel',
        'shrutipatel.dev@gmail.com',
        '/uploads/shruti_patel_resume.pdf',
        JSON.stringify({
          about: true,
          experience: true,
          skills: true,
          projects: true,
          education: true,
          contact: true
        })
      ]
    );
    console.log('Seeded website settings.');
  }
};

// If run directly
if (process.argv[1] && process.argv[1].endsWith('initSeed.js')) {
  seedData()
    .then(() => {
      console.log('Database initialization and seeding completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
