
# SchoolDekho

## Overview
**SchoolDekho** is a mini web app built with **Next.js** and **MySQL** to add and explore schools.  
It includes a form for adding schools (with image upload) and a grid view to browse them.

## Features
- Add school details (name, address, city, state, contact, email, image) with validation  
- Browse schools in a responsive grid with images and info  
- Reusable Navbar & simple landing page with background + CTA  
- Fully responsive UI with modern CSS modules  
- MySQL integration for storing and fetching school data  

## Tech Stack
- **Next.js (App Router)**  
- **MySQL**  
- **CSS Modules**


## Folder Structure

```
app/
  addSchool/
    addSchool.module.css
    page.jsx
  api/
    schools/
      route.js
  components/
    Navbar.jsx
    Navbar.module.css
  showSchools/
    page.jsx
    showSchools.module.css
  favicon.ico
  globals.css
  layout.js
  page.js
  page.module.css
lib/
  db.js
public/
  ...
```


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
   ```

4. **Set up MySQL database**

   Create the `schools` table using this SQL command:

   ```sql
   CREATE TABLE schools (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name TEXT NOT NULL,
     address TEXT NOT NULL,
     city TEXT NOT NULL,
     state TEXT NOT NULL,
     contact VARCHAR(20) NOT NULL,
     image TEXT NOT NULL,
     email_id VARCHAR(255) NOT NULL
   );
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Access the app**

   Open [http://localhost:3000](http://localhost:3000) in your browser.


## Roadmap / Future Plans

- **School Detail Page:**  
  Add a dedicated page to view detailed information about each school.

- **Search & Filter in ShowSchools:**  
  Implement search and filtering options to easily find schools by name, city, or state.

- **Edit & Delete Schools:**  
  Allow users to update or remove school entries.

- **User Authentication:**  
  Add login and registration for secure access and management.

- **Image Upload Improvements:**  
  Support multiple images and better image handling.

- **Responsive Design Enhancements:**  
  Improve mobile and tablet experience.

- **API Improvements:**  
  Add pagination, sorting, and better error handling to API endpoints.

##  Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork this repo and open a PR.


##  Author

**Aryan Agrahari**  
- [LinkedIn](https://www.linkedin.com/in/valak70/)  
- [GitHub](https://github.com/valak70)  
