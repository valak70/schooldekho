
# SchoolDekho

## Overview
**SchoolDekho** is a mini web app built with **Next.js** and **MySQL** to add and explore schools.  
It includes a form for adding schools (with image upload) and a grid view to browse them.

## Features
- Add school details (name, address, city, state, contact, email, image) with validation
- Browse schools in a responsive grid with images and info
- Edit and delete school entries (protected, only for logged-in users)
- OTP-based user registration and login system
- Conditional rendering based on user authentication
- Fully responsive UI with modern CSS modules
- Image upload support (local storage or Cloudinary)


## Tech Stack
- **Next.js (App Router)**  
- **MySQL**  
- **CSS Modules**
  
## Deployment Information

This project is deployed at: [https://schooldekho.onrender.com/](https://schooldekho.onrender.com/) (Render termporarily shuts the service when inactive so you might have to wait for a minute on the page while render restarts the service)

### Infrastructure and Services Used

- **Database:** AWS RDS (Amazon Relational Database Service) MySQL instance.  
  A managed, highly available MySQL database hosted on AWS powering the backend data store.

- **Image Storage:** Cloudinary.  
  Cloudinary is used for storing and serving school images in production, ensuring reliable, scalable image management.

- **Hosting Platform:** Render.com  
  The Next.js application is hosted on Render's managed server platform, supporting persistent server processes and environment variable management.

---


## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/valak70/schooldekho.git
   cd schooldekho
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file at the project root with your MySQL credentials:

   ```
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
   
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name    # Cloudinary Credentials(optional)
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    USE_CLOUDINARY=true    #Use Cloudinary in production (set to 'true' for prod, 'false' for local file saving)

    JWT_SECRET=replace_with_strong_random_secret
    
    # If using Gmail OAuth2 
    EMAIL_SECRET=replace_with_email_token_secret
    EMAIL_USER=you@example.com
    OAUTH_CLIENT_ID=your_google_oauth_client_id
    OAUTH_CLIENT_SECRET=your_google_oauth_client_secret
    OAUTH_REFRESH_TOKEN=your_google_oauth_refresh_token
    OAUTH_REDIRECT_URI=https://developers.google.com/oauthplayground
   
   ```
- Set `USE_CLOUDINARY=true` when deploying to production to enable Cloudinary uploads.
- For local development or environments without Cloudinary, set `USE_CLOUDINARY=false` or omit this variable to fall back to saving images locally in the `/public/schoolImages/` folder.
4. **Set up MySQL database**

   Create the tables using SQL commands in tableSchema.sql in root directory

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Access the app**

   Open [http://localhost:3000](http://localhost:3000) in your browser.


### Database Setup Caution
- Use schoolData.sql from root directory to populate sample school data(Just copy the entire file and paste it as mysql query inside your database).
- Make sure the MySQL user you use has privileges to access and modify the database.
- If you encounter "Access denied" errors, verify that the user has the necessary privileges.

---
### How to Deploy

1. Push your code with proper `.env` configuration to GitHub or equivalent repository.

2. Connect your repository to [Render.com](https://render.com) and create a new Web Service.

3. In Render’s dashboard, add the environment variables from above with your actual credentials.

4. Deploy and monitor logs for build success.

5. Access your live app at [https://schooldekho.onrender.com/](https://schooldekho.onrender.com/).

---

### Notes

- **File Uploads:**  
  Local image uploads are only suitable for local development due to ephemeral file storage in cloud hosting. Use Cloudinary in production.

- **Database Access:**  
  Ensure AWS RDS security groups allow inbound connections from your Render service's IP or CIDR range.

---


## Roadmap / Future Plans

- **School Detail Page:**  
  Add a dedicated page to view detailed information about each school.

- **Search & Filter in ShowSchools:**  
  Implement search and filtering options to easily find schools by name, city, or state.

- **Image Upload Improvements:**  
  Support multiple images and better image handling.

- **API Improvements:**  
  Add pagination, sorting, and better error handling to API endpoints.

##  Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork this repo and open a PR.


##  Author

**Aryan Agrahari**  
- [LinkedIn](https://www.linkedin.com/in/valak70/)  
- [GitHub](https://github.com/valak70)  
