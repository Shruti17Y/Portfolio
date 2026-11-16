# Shruti Patel | Full Stack Developer Portfolio

A responsive developer portfolio and content management system built for **Shruti Patel**, a Full Stack Developer. The public website presents professional experience, technical skills, projects, education, contact information, profile photography, and a downloadable resume. A protected admin panel provides full content management without editing source code.

## Live Website

- **Portfolio:** [portfolio-ux6l.vercel.app](https://portfolio-ux6l.vercel.app/)
- **Admin panel:** [portfolio-ux6l.vercel.app/admin/login](https://portfolio-ux6l.vercel.app/admin/login)
- **Backend health check:** [portfolio-caym.onrender.com/api/health](https://portfolio-caym.onrender.com/api/health)

## Features

### Public portfolio

- Responsive, minimalist interface for desktop and mobile
- Hero section with profile image, introduction, social links, and resume download
- About, experience, skills, projects, education, and contact sections
- Featured and company project support
- Dynamic content loaded from the backend API
- Configurable section visibility and website settings

### Admin CMS

- JWT-protected admin authentication
- Profile, experience, skills, projects, and education management
- Drag/reorder support for managed content
- Profile image, project image, and PDF resume uploads
- Contact message inbox with read/unread status
- Website title, logo, footer, links, resume path, and section settings
- Admin account and password management

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS, React Router, Lucide React |
| Backend | Node.js, Express.js, REST API, Multer |
| Database | PostgreSQL with `pg` |
| Authentication | JWT and bcryptjs |
| Frontend hosting | Vercel |
| Backend hosting | Render |



## Local Development

### Prerequisites

- Node.js 18 or newer
- PostgreSQL 14 or newer
- Git

### 1. Clone and install dependencies

```bash
git clone https://github.com/Shruti17Y/Portfolio.git
cd Portfolio

npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure the backend

Create `backend/.env`:

```env
PORT=5000
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_postgres_password
PGDATABASE=portfolio_db
JWT_SECRET=replace_with_a_long_random_secret
```

The backend creates the required PostgreSQL tables when it starts. Keep `.env` files private and never commit credentials.

### 3. Start the backend

```bash
npm run dev:backend
```

The API runs at `http://localhost:5000`.

### 4. Start the frontend

```bash
npm run dev:frontend
```

The Vite development server runs at `http://localhost:3000`. API and upload requests are proxied to the backend.

## Environment Variables

### Frontend

Set `frontend/.env` when the API is not the default deployed backend:

```env
VITE_API_URL=http://localhost:5000/api
```

The production frontend defaults to `https://portfolio-caym.onrender.com/api` when `VITE_API_URL` is not set.

### Backend

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Express server port | `5000` |
| `PGHOST` | PostgreSQL host | `127.0.0.1` |
| `PGPORT` | PostgreSQL port | `5432` |
| `PGUSER` | PostgreSQL user | `postgres` |
| `PGPASSWORD` | PostgreSQL password | `postgres` |
| `PGDATABASE` | PostgreSQL database | `portfolio_db` |
| `JWT_SECRET` | Secret used to sign authentication tokens | required for production |

## Production Deployment

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set the project root to `frontend`.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Set `VITE_API_URL` to the deployed backend API URL, for example:

   ```text
   https://portfolio-caym.onrender.com/api
   ```

### Backend on Render

1. Create a Node web service using the repository.
2. Set the root directory to `backend`.
3. Use `npm install` as the build command.
4. Use `npm start` as the start command.
5. Configure the PostgreSQL and JWT environment variables in Render.
6. Add the deployed Vercel URL to the backend CORS allowlist.

## Uploads

Portfolio assets in `backend/uploads/` are tracked in this repository so they are available after deployment. Uploaded files are served by the backend at:

```text
https://portfolio-caym.onrender.com/uploads/<filename>
```

The current implementation uses the backend filesystem for uploads. On hosting platforms where the filesystem is ephemeral, newly uploaded files can be lost after a restart or redeploy. For durable production uploads, use object storage such as Cloudinary, Amazon S3, or a persistent Render disk.

## Available Commands

From the repository root:

```bash
npm run dev:backend   # Start backend in watch mode
npm run dev:frontend  # Start Vite development server
npm run build         # Build the frontend for production
npm run seed          # Seed the backend database
```

## Security Notes

- Do not commit `.env` files, passwords, JWT secrets, or database credentials.
- Change any development administrator credentials before production use.
- Use a strong, unique `JWT_SECRET` in production.
- Restrict backend CORS origins to trusted frontend domains.
- Use persistent object storage for production uploads.

## License

This project is maintained as a personal portfolio application by Shruti Patel.
