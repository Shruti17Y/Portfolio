import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const pdfContent = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj
4 0 obj <</Length 280>> stream
BT
/F1 22 Tf
50 720 Td
(Shruti Patel - Full Stack Developer) Tj
/F1 12 Tf
0 -35 Td
(Email: shrutipatel.dev@gmail.com | Portfolio Developer Resume) Tj
0 -25 Td
(Technical Expertise: React.js, Node.js, Express.js, PostgreSQL, MongoDB, Python, Django) Tj
0 -25 Td
(Experience: Full Stack Developer at KONCPT AI | Software Developer Intern at Petpooja) Tj
0 -25 Td
(Education: B.Tech in Computer Science / IT - LJ Institute of Engineering and Technology) Tj
ET
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000557 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
634
%%EOF`;

fs.writeFileSync(path.join(uploadDir, 'shruti_patel_resume.pdf'), pdfContent);
console.log('PDF generated at:', path.join(uploadDir, 'shruti_patel_resume.pdf'));
