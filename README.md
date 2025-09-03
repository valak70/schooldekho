# SchoolDekho Mini-Project

## Overview

SchoolDekho is a small web application built with Next.js and MySQL that allows users to add and browse schools. It consists of two main pages: one for adding school details with image upload, and another for displaying the list of schools in a responsive, user-friendly layout.

The home page features a navigation bar with logo and buttons to navigate between pages, a background image, and prominent call-to-action buttons to explore or add schools.

---

## Features

- **Add School Page**: Form to input school details such as name, address, city, state, contact number, email, and upload an image. Uses `react-hook-form` for validation and uploads images to `/public/schoolImages`.
- **Show Schools Page**: Displays a grid of schools with name, address, city, and image fetched from MySQL.
- **Reusable Navbar Component**: Common navigation bar with logo and links.
- **Home Page**: Attractive landing page with background image, navigation bar, "Explore Schools" button, and floating add ("+") button.
- **Responsive Design**: Fully responsive across mobile and desktop devices.
- **MySQL Integration**: Stores and retrieves school data with secure, parameterized queries.
- **Image Upload**: Stores school images in a public folder accessible by the frontend.

---

## Technology Stack

- **Next.js** (latest) with App Router
- **MySQL** database
- **CSS Modules** for scoped styling


## Features

- Add new schools with details and images
- View a list of schools
- Responsive UI with modular components

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