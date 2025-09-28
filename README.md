> Warranty Wallet<

Warranty Wallet is a professional full-stack web application for managing product warranties. Users can securely store and track warranty details, upload receipts or PDF warranty documents, and receive automatic reminders before warranties expire. It also features an AI Assistant chatbot powered by OpenAI for quick warranty-related guidance.

Live Demo: <https://devitowarranty.xyz>

Key Features:

- Secure user registration & login (JWT)

- Add and manage product warranties.

- Upload and view receipts in PDF format.

- Dashboard for active and expired warranties.

- Automatic email reminders for expiring warranties.

- AI Assistant chatbot for user support.

- Fully responsive, mobile-first design.

- Smooth UX with animated interactions and modals.

Technology Stack:\
Frontend: React 19, Vite, React Router, React Bootstrap, React Datepicker, Framer Motion, Sass\
Backend: Node.js, Express, MySQL2, JWT, Multer, Node-Cron, Nodemailer + Mailgun, OpenAI API\
DevOps & Deployment: Docker, Docker Compose, GitHub Actions CI/CD, DigitalOcean VPS, Namecheap domain\
Utilities & Dev Tools: Axios, ESLint, Bootstrap

Getting Started (Developers):

1.  Clone the repository:\
    git clone <https://github.com/Vitomirov/warranty-wallet.git>\
    cd warranty-wallet

2.  Backend setup:\
    cd backend\
    npm install\
    cp .env.example .env # configure your environment variables\
    npm run dev

3.  Frontend setup:\
    cd frontend\
    npm install\
    npm run dev

Default frontend: <http://localhost:5173>

Folder Structure (simplified):\
warranty-wallet/

- backend/ (routes, controllers, middlewares, db.js, server.js, Dockerfile, docker-compose.yml)

- frontend/ (components, context, pages, App.jsx, main.jsx, Dockerfile, vite.config.js)

- .github/workflows/ci-cd.yml

- README.md

Development & Testing Notes:

- API requests can be tested directly with Axios

- Environment variables stored in .env files

- CI/CD automatically builds, tests, and deploys Docker containers

Deployment:

- Build Docker containers: docker-compose -f docker-compose.dev.yml up --build -d

- Backend: port 5000, Frontend: port 5173

- GitHub Actions automatically deploys updates to VPS

Contact:\
Dejan Vitomirov\
Email: dejan.vitomirov@gmail.com

Professional full-stack project demonstrating React, Node.js, MySQL, Docker, CI/CD, and AI integration, ideal for showcasing skills to both recruiters and developers.
