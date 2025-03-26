# Warranty Wallet

Warranty Wallet is a warranty management application.

## Technologies

* Backend: Node.js, Express.js, MySQL
* Frontend: Nginx, (JavaScript framework)
* Database: MySQL 8.0
* Containerization: Docker, Docker Compose

## Features

* Warranty management
* Database for warranty information
* API for interaction
* User interface
* Email sending
* File upload
* User authentication

## Getting Started

Follow these steps to run the application:

### Prerequisites

* Docker and Docker Compose must be installed on your system.

### Configuration

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Create the `.env` file:**

    * In the root directory of the project, create a file named `.env`.

3.  **Populate the `.env` file:**

    * Open the `.env` file in a text editor and add the following environment variables:

        ```
        SECRET_KEY=<your_secret_key>
        REFRESH_SECRET_KEY=<your_refresh_secret_key>

        # Email Credentials (For Sending Emails)
        MAILTRAP_HOST=sandbox.smtp.mailtrap.io
        MAILTRAP_PORT=2525
        MAILTRAP_USER=<your_mailtrap_user>
        MAILTRAP_PASS=<your_mailtrap_password>

        # Database Configuration - localhost for development, mysql for Docker
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

    * Replace the placeholder values (`<your_...>`) with your actual values.
    * **Mailtrap:**
        * If you want to test email functionality, you can use my Mailtrap account details:
            * `MAILTRAP_USER=7abe50222732bf`
            * `MAILTRAP_PASS=0f5cf0f7f4faa8`
        * Otherwise, provide your own Mailtrap credentials or remove the Mailtrap-related lines from the `.env` file.
        * If you want to check sent mails, you can log in to Mailtrap with this details:
            * email address: `dejan.vitomirov@gmail.com`
            * password: `DeVito123!@#`
    * **Database:**
        * `DB_HOST=mysql` must remain as it is, as it refers to the MySQL service within the Docker network.
        * Choose your own values for `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, and `MYSQL_ROOT_PASSWORD`.
    * **Secret keys:**
        * Generate random, strong strings for `SECRET_KEY` and `REFRESH_SECRET_KEY`.
    * **Redis:**
        * `REDIS_HOST=redis` must remain.
    * **Port:**
        * You can change the `PORT` if needed.
    * **Node Environment:**
        * `NODE_ENV=production` is recommended for production environments.

### Running the Application

1.  **Start the application:**

    * In the terminal, navigate to the project's root directory and run:

        ```bash
        docker-compose up -d
        ```

2.  **Access the application:**

    * Frontend: `http://localhost`
    * Backend: `http://localhost:3000`

## Project Structure

* `src/backend`: Contains the backend code.
* `src/frontend`: Contains the frontend code.
* `db_init`: Contains SQL scripts for database initialization.
* `docker-compose.yml`: Defines the Docker services.
* `.env`: Stores environment variables (not included in the repository).

## Important Notes

* Never commit the `.env` file to a public repository, as it contains sensitive information.
* Ensure that Docker and Docker Compose are running before executing `docker-compose up -d`.
* If you encounter any issues, check the Docker logs for error messages. You can view the logs using `docker-compose logs <service_name>`.

## Author

Vitomirov Dejan