# Warranty Wallet

Warranty Wallet is a warranty management application.

## **Technologies**

- **Backend:** Node.js, Express.js, MySQL
- **Frontend:** Nginx, (JavaScript framework)
- **Database:** MySQL 8.0 (within Docker)
- **Containerization:** Docker, Docker Compose

## **Features**

- Warranty management
- Database for warranty information
- API for interaction
- User interface
- Email sending
- File upload
- User authentication

## **Getting Started**

This application uses Docker and Docker Compose for easy setup and deployment. You do **not** need to have MySQL installed on your system.

### **Prerequisites**

Before you begin, install the following software:

- **Git:** [Download Git](https://git-scm.com/downloads)
- **Docker Desktop:** [Download Docker Desktop](https://www.docker.com/products/docker-desktop) (Includes Docker Compose)

### **Configuration**

#### 1. Clone the repository:

```bash
git clone git@github.com:Vitomirov/warranty-wallet.git
```

```bash
cd warranty-wallet
```

#### 2. Create the `.env` file:

Create a new file in the project's root directory named `.env`.

#### 3. Populate the `.env` file:

Copy and paste the following, replacing placeholders with actual values:

```bash
SECRET_KEY=<your_secret_key>
REFRESH_SECRET_KEY=<your_refresh_secret_key>

# Email Credentials (For Sending Emails)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=<your_mailtrap_user>
MAILTRAP_PASS=<your_mailtrap_password>

# Database Configuration - MySQL within Docker
DB_HOST=mysql
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_DATABASE=<your_database_name>
MYSQL_ROOT_PASSWORD=<your_mysql_root_password>

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Backend Configuration
PORT=3000
NODE_ENV=production
```

> **Important:** Replace `<your_...>` with actual values.

### **Running the Application**

#### 1. Start the application:

```bash
docker-compose up --build -d
```

This command will:

- Download necessary Docker images.
- Create and start Docker containers.
- Initialize the MySQL database (if an `init.sql` file exists).
- The `-d` flag runs containers in the background.

#### 2. Access the application:

- [https://localhost](https://localhost)

### **Checking Database Logs (Optional)**

If you encounter issues or want to verify database initialization:

```bash
docker-compose logs mysql
```

## **Project Structure**

- `src/backend` - Backend code.
- `src/frontend` - Frontend code.
- `db_init` - SQL scripts for database initialization.
- `docker-compose.yml` - Defines Docker services.
- `.env` - Stores environment variables (not included in the repository).

## **Important Notes**

- **Security:** Never commit the `.env` file to a public repository.
- **Docker Desktop:** Ensure Docker Desktop is running before executing `docker-compose up -d`.
- **Troubleshooting:** Check Docker logs for errors using:

```bash
docker-compose logs <service_name>
```

Replace `<service_name>` with `warranty_backend`, `warranty_nginx`, or `warranty_mysql`.

## **Author**

Vitomirov Dejan
