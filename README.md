#   **Warranty Wallet**

    Warranty Wallet is a warranty management application.

    ##  **Technologies**

    * Backend: Node.js, Express.js, MySQL
    * Frontend: Nginx, (JavaScript framework)
    * Database: MySQL 8.0 (within Docker)
    * Containerization: Docker, Docker Compose

    ##  **Features**

    * Warranty management
    * Database for warranty information
    * API for interaction
    * User interface
    * Email sending
    * File upload
    * User authentication

    ##  **Getting Started**

    This application uses Docker and Docker Compose for easy setup and deployment. You do **not** need to have MySQL installed on your system.

    ###   **Prerequisites**

    Before you begin, you need to have the following software installed on your computer:

    * **Git:** Git is a version control system used to download the application's code. You can download and install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads)
    * **Docker Desktop:** Docker Desktop is an application that allows you to run Docker containers. You can download and install Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop). Docker Desktop includes Docker Compose.

    ###   **Configuration**

    1.  **Clone the repository:**

        * Open your terminal or command prompt.
        * Use the following command to download the application's code from GitHub:

            ```bash
            git clone git@github.com:Vitomirov/warranty-wallet.git
            ```

        * This will create a folder named `warranty-wallet` in your current directory.
        * Navigate into the `warranty-wallet` directory using the following command:

            ```bash
            cd warranty-wallet
            ```

    2.  **Create the `.env` file:**

        * In the root directory of the project (the `warranty-wallet` directory), you need to create a file named `.env`.
        * You can create this file using a text editor (like Notepad on Windows, TextEdit on macOS, or any code editor).

    3.  **Populate the `.env` file:**

        * Open the `.env` file in your text editor.
        * Add the following environment variables to the file:

            ```bash
            SECRET_KEY=<your_secret_key>
            REFRESH_SECRET_KEY=<your_refresh_secret_key>

            #   Email Credentials (For Sending Emails)
            MAILTRAP_HOST=sandbox.smtp.mailtrap.io
            MAILTRAP_PORT=2525
            MAILTRAP_USER=<your_mailtrap_user>
            MAILTRAP_PASS=<your_mailtrap_password>

            #   Database Configuration - MySQL within Docker
            DB_HOST=mysql
            DB_USER=<your_database_user>
            DB_PASSWORD=<your_database_password>
            DB_DATABASE=<your_database_name>
            MYSQL_ROOT_PASSWORD=<your_mysql_root_password>

            #   Redis Configuration
            REDIS_HOST=redis
            REDIS_PORT=6379

            #   Backend Configuration
            PORT=3000
            NODE_ENV=production
            ```

        * **Important:** You need to replace the placeholder values (`<your_...>`) with your actual values.

        * **Mailtrap:**

            * If you want to test email functionality, you can use these Mailtrap account details:
                * `MAILTRAP_USER=7abe50222732bf`
                * `MAILTRAP_PASS=0f5cf0f7f4faa8`
            * Otherwise, provide your own Mailtrap credentials or remove the Mailtrap-related lines from the `.env` file.
            * If you want to check sent mails, you can log in to Mailtrap with these details:
                * email address: `dejan.vitomirov@gmail.com`
                * password: `DeVito123!@#`

        * **Database:**

            * `DB_HOST=mysql` **must** remain as it is. This tells the backend to connect to the MySQL database running inside the Docker network.
            * Choose your own values for `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, and `MYSQL_ROOT_PASSWORD`. These values will be used to configure the MySQL database within the Docker container.

        * **Secret keys:**

            * Generate random, strong strings for `SECRET_KEY` and `REFRESH_SECRET_KEY`. These keys are used for security purposes.

        * **Redis:**

            * `REDIS_HOST=redis` must remain.

        * **Port:**

            * You can change the `PORT` if needed. This is the port the backend application will listen on.

        * **Node Environment:**

            * `NODE_ENV=production` is recommended for production environments.

    ###   **Running the Application**

    1.  **Start the application:**

        * Open your terminal or command prompt.
        * Navigate to the project's root directory (the `warranty-wallet` directory) if you're not already there.
        * Use the following command to start the application using Docker Compose:

            ```bash
            docker-compose up -d
            ```

        * This command will:
            * Download the necessary Docker images from Docker Hub.
            * Create and start the Docker containers (MySQL, backend, frontend, etc.).
            * Initialize the MySQL database (if you have an `init.sql` file).
        * The `-d` flag runs the containers in the background.

    2.  **Access the application:**

        * Once the containers are running, you can access the application:
            * Frontend: Open your web browser and go to `http://localhost`.
            * Backend: You can access the backend API at `http://localhost:3000`.

    ###   **Checking Database Logs (Optional)**

    * If you encounter issues or want to verify that the database initialized correctly, you can check the MySQL container's logs:

        ```bash
        docker-compose logs mysql
        ```

        * This command will display the logs for the MySQL container, which can be helpful for debugging.

    ##  **Project Structure**

    * `src/backend`: Contains the backend code.
    * `src/frontend`: Contains the frontend code.
    * `db_init`: Contains SQL scripts for database initialization (if present).
    * `docker-compose.yml`: Defines the Docker services.
    * `.env`: Stores environment variables (not included in the repository).

    ##  **Important Notes**

    * **Security:** Never commit the `.env` file to a public repository, as it contains sensitive information like passwords and API keys.
    * **Docker Desktop:** Make sure Docker Desktop is running before executing `docker-compose up -d`.
    * **Troubleshooting:** If you encounter errors, check the Docker logs for error messages. You can view the logs using `docker-compose logs <service_name>`, replacing `<service_name>` with the name of the service (e.g., `backend`, `frontend`, `mysql`).

    ##  **Author**

    Vitomirov Dejan
    ```