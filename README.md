# Full Stack Developer Portfolio with Dynamic Admin Panel (CMS)

A modern, responsive, minimalist portfolio website for **Shruti Patel (Full Stack Developer)** built strictly with **React.js, Tailwind CSS, Node.js, Express.js, and PostgreSQL**.

---

## 🌟 Live Architecture Overview

- **Public Portfolio URL:** [http://localhost:5000/](http://localhost:5000/)
- **Admin Panel URL:** [http://localhost:5000/admin/login](http://localhost:5000/admin/login)
- **Default Admin Credentials:**
  - **Username:** `admin` (or `admin@shruti.dev`)
  - **Password:** `Admin@123`
- **Database:** PostgreSQL (`portfolio_db` on `127.0.0.1:5432`)

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js 18, Tailwind CSS, Lucide React Icons, React Router v6 |
| **Backend** | Node.js, Express.js, REST APIs, Multer (file uploads) |
| **Database** | PostgreSQL (`pg` connection pool with relational schema) |
| **Security & Auth** | JWT (JSON Web Tokens), bcryptjs password hashing |

---

## 📋 Features

### 1. Public Portfolio
- **Minimalist Aesthetics:** Pure white background, black and dark-charcoal typography, subtle borders (`border-zinc-200`), and smooth scrolling.
- **Hero Section:** Introduction, designation, customizable profile photo, "Download Resume" CTA, "View Projects" CTA, and active GitHub/LinkedIn/Email links.
- **About Me:** Dynamic overview of full-stack expertise, backend API architecture, and database engineering.
- **Work Experience:**
  - **KONCPT AI** (Full Stack Developer, Dec 2023 - Present)
  - **Petpooja** (Software Developer Intern, May 2023 - Nov 2023)
- **Categorized Skills:**
  - **Frontend:** React.js, JavaScript, HTML, CSS, Tailwind CSS
  - **Backend:** Node.js, Express.js, Python, Django, REST APIs
  - **Database:** PostgreSQL, MongoDB, IndexedDB
  - **Tools & Technologies:** Git, GitHub, Postman, VS Code, JWT Authentication, Role-Based Access Control
- **Featured Projects:**
  1. **Freedom Foundation** (NGO management platform with Razorpay payment integration)
  2. **GateKeep** (Residential society management platform with visitor, amenity, and helpdesk modules)
  3. **LeadNxt CRM** (Customer relationship management suite with pipeline tracking)
  4. **PropSpy** (Property intelligence & listing management platform)
- **Education Section:**
  - B.Tech in Computer Science / IT (LJ Institute of Engineering and Technology, Semester 3 SPI: 8.46/10)
  - HSC: GSEB – 74.09 Percentile (2023)
  - SSC: GSEB – 98.91 Percentile (2021)
- **Contact Form:** Submits directly to PostgreSQL through `/api/messages`, with instant status alerts and unread message notifications in the admin panel.

---

### 2. Admin Panel (Complete CMS)
- **Dashboard Overview:** Metric cards (Total Projects, Total Skills, Total Experiences, Total Messages, Total Education) and recent inquiries table.
- **Profile Management:** Edit name, designation, intro paragraph, about me text, contact links, upload profile image, and upload resume PDF.
- **Experience Management:** Add, edit, delete, and reorder career records with dynamic bulleted responsibilities.
- **Skills Management:** Create and edit skill categories and individual skills with display ordering.
- **Project Management:** Add, edit, delete, upload project screenshot, set tech stacks, GitHub/Demo URLs, and toggle featured status.
- **Education Management:** Add, edit, and delete academic qualifications and scores.
- **Contact Messages:** Read, mark as read/unread, delete, and mailto reply to inquiries.
- **Website Settings:** Customize browser title, logo text, footer copyright, resume download path, and toggle portfolio sections on or off.
- **Account Security:** Update admin username, email, and change password securely with bcrypt verification.

---

## 🚀 Running the Project

### Prerequisites
1. **Node.js** (v18+ or v22+)
2. **PostgreSQL** (running on port 5432 with database `portfolio_db`)

### 1. Backend Server Setup
```bash
cd backend
npm install
node src/server.js
```
*The server will automatically connect to PostgreSQL, verify all tables, seed initial resume data, and listen on `http://localhost:5000`.*

### 2. Frontend Development Server (Optional)
To run frontend in Vite development mode with hot-reloading:
```bash
cd frontend
npm install
npm run dev
```
*Vite will start on `http://localhost:3000` and automatically proxy API calls to port 5000.*

### 3. Production Build
```bash
cd frontend
npm run build
```
*The backend Express server automatically serves the compiled `frontend/dist` build at `http://localhost:5000`.*
