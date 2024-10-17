Warranty Wallet

Warranty Wallet is an application designed to help users manage and track warranty information for their purchased products.
Features

    Authentication: Users can register or sign in to access and manage their warranties.
    Dashboard: Provides an overview of all warranties, with options to add new ones and view detailed information.
    Add Warranty: Users can add a new warranty by entering basic details, including uploading warranty-related files.
    Warranty Details: Users can view the full details of each warranty, such as purchase and expiration dates.
    My Warranties: Displays a list of all warranties belonging to the logged-in user.
    Delete Warranty: Users can remove unwanted warranties from their account.
    Private Routes: Certain pages, like the dashboard and warranty management, are protected and only accessible to logged-in users.
    Logout: Users can log out from the app, securely ending their session.

Current Status

The project is under active development. So far, the following functionalities have been implemented:

    Core frontend components, including login, registration, dashboard, warranty addition, warranty details, and warranty deletion.
    Backend functionalities for managing user accounts, warranty storage, and authentication.
    Integration of protected routes using JWT authentication to secure user data.
    Basic file upload functionality using Multer for warranty-related images.

Planned Enhancements

    Automatic Expiry Notifications: Users will receive email notifications when warranties are about to expire.

Technologies Used
Frontend:

    React: Main framework for the user interface.
    React Router: Handles routing between various pages (login, dashboard, warranty details, etc.).
    Vite: Used as the development environment for fast builds and hot reloading.
    HTML/CSS: Provides the structure and styling for the application.

Backend:

    Node.js & Express: Powers the API for managing users, warranties, and data.
    MySQL2: Used for database management, storing user data and warranties.
    Multer: Manages file uploads (e.g., warranty images).

Authentication & Security:

    JWT: Used for secure user authentication and route protection.
    bcrypt: Ensures secure password hashing for user data protection.

Additional Tools:

    Axios: Handles API requests from the frontend to the backend.
    dotenv: Manages environment variables for secure configuration.
    ESLint: Ensures code quality and consistency.

How to Run the Project

    Clone the repository to your local machine.
    Install all necessary dependencies.
    Start the backend server to handle API requests and data management.
    Start the frontend application to interact with the user interface and manage warranties.

