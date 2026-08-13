# 📚 Smart Study Planner

A full-stack web application designed to help students organize their academic activities, manage assignments and learning resources, track submissions, and monitor their study progress in one place.

> 🎓 **College Mini Project**
> 👥 **Team Size:** 3
> 🚧 **Status:** Completed — currently running locally

---

## 📌 About the Project

**Smart Study Planner** is a web-based academic management system developed to make it easier for students to organize and manage their academic activities.

The application provides different functionalities for students and administrators, including assignment management, learning resources, submissions, progress tracking, and administrative management.

The system is built using a **React + TypeScript frontend** and an **ASP.NET Core Web API backend**, with **Microsoft SQL Server** as the database.

The project also includes **Docker and Docker Compose** configuration for running the application components together in a containerized development environment.

---

## ✨ Key Features

### 👨‍🎓 Student Management

* Student registration and authentication
* Student dashboard
* Profile and account settings
* Academic activity management

### 📝 Assignment Management

* Create and manage assignments
* Track assignment deadlines
* Monitor assignment status
* Manage assignment-related information

### 📚 Resource Management

* Add and manage learning resources
* Resource categorization
* File/resource handling
* Access resources through the application

### 📤 Submission Management

* Manage student submissions
* Track submission information
* Submission-related status management

### 📊 Reports & Progress

* View academic progress
* Generate reports
* Display information through charts and visualizations

### 🛡️ Administration

* Admin dashboard
* Student management
* Teacher management
* Class management
* Authorized-user management

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* ASP.NET Identity
* Role-based access
* Protected API endpoints

---

## 🏗️ System Architecture

The application follows a client-server architecture:

```text
                 ┌─────────────────────────┐
                 │     React Frontend      │
                 │   TypeScript + Vite     │
                 └────────────┬────────────┘
                              │
                              │ REST API
                              ▼
                 ┌─────────────────────────┐
                 │    ASP.NET Core API     │
                 │        C# Backend       │
                 │                         │
                 │ Controllers             │
                 │ Authentication          │
                 │ Business Logic           │
                 │ Entity Framework Core    │
                 └────────────┬────────────┘
                              │
                              │ EF Core
                              ▼
                 ┌─────────────────────────┐
                 │     SQL Server DB       │
                 └─────────────────────────┘
```

Docker Compose can be used to run the major application components together.

---

## 🛠️ Technology Stack

| Category             | Technology             |
| -------------------- | ---------------------- |
| Frontend             | React                  |
| Language             | TypeScript             |
| Build Tool           | Vite                   |
| Backend              | ASP.NET Core Web API   |
| Backend Language     | C#                     |
| ORM                  | Entity Framework Core  |
| Database             | Microsoft SQL Server   |
| Authentication       | ASP.NET Identity + JWT |
| API Documentation    | Swagger / OpenAPI      |
| HTTP Client          | Axios                  |
| Routing              | React Router           |
| Charts               | Recharts               |
| Containerization     | Docker                 |
| Container Management | Docker Compose         |
| Web Server           | Nginx                  |

---

## 👥 Team Members & Contributions

This project was developed collaboratively by a team of three.

### 👩‍💻 Bineeta Khanal — Backend Developer

**Main contribution:**

* Developed backend functionality using ASP.NET Core and C#
* Developed RESTful API endpoints
* Worked with Entity Framework Core
* Integrated the SQL Server database
* Implemented CRUD functionality
* Worked on authentication and authorization
* Connected backend APIs with the React frontend
* Worked with Swagger for API testing and documentation
* Worked with Docker-based backend/database configuration

### 👩‍💻 Neha Khanal — Frontend Developer

**Main contribution:**

* Developed frontend interfaces using React and TypeScript
* Worked on reusable UI components
* Implemented frontend pages and navigation
* Integrated frontend functionality with backend APIs
* Worked on responsive and user-friendly interface design

### 👩‍💻 Khushi Ghimire — Frontend Developer

**Main contribution:**

* Developed frontend pages and components
* Worked on UI layout and styling
* Implemented frontend functionality
* Integrated application pages with backend services
* Contributed to improving the overall user experience

---

## 📁 Project Structure

```text
Helpers/
│
├── Backend/
│   └── SmartStudyPlanner/
│       ├── Controllers/
│       ├── Migrations/
│       ├── Models/
│       ├── Services/
│       ├── wwwroot/
│       │   └── Uploads/
│       ├── ApplicationDbContext.cs
│       ├── Program.cs
│       └── SmartStudyPlanner.csproj
│
├── src/
│   ├── admin/
│   ├── components/
│   ├── context/
│   ├── layout/
│   ├── pages/
│   ├── styles/
│   ├── sysadmin/
│   ├── App.tsx
│   └── main.tsx
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔌 Backend API

The backend is implemented using **ASP.NET Core Web API**.

The API is organized into controllers responsible for different parts of the system, including:

* Authentication
* Registration
* Students
* Assignments
* Resources
* Submissions
* Reports
* Settings
* Admin dashboard
* Admin students
* Admin teachers
* Admin classes
* Authorized users

Swagger/OpenAPI is included to make it easier to test and explore the available APIs during development.

---

## 🗄️ Database

The application uses **Microsoft SQL Server** for persistent data storage.

**Entity Framework Core** is used to communicate with the database and manage migrations.

The project also uses **ASP.NET Identity** for managing users and roles.

### User Roles

* Student
* Admin
* Sysadmin

---

## 🐳 Docker Setup

The project includes Docker configuration for running the application in containers.

The Docker Compose setup contains services for:

* Frontend
* ASP.NET Core backend
* SQL Server database

### Start the project with Docker

Clone the repository:

```bash
git clone https://github.com/Bineeta123/Helpers.git
cd Helpers
```

Build and start the containers:

```bash
docker compose up --build
```

Stop the containers:

```bash
docker compose down
```

To remove containers and the associated database volume:

```bash
docker compose down -v
```

---

## 💻 Running the Project Locally

### Frontend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

### Backend

Navigate to the backend project:

```bash
cd Backend/SmartStudyPlanner
```

Restore dependencies:

```bash
dotnet restore
```

Run the backend:

```bash
dotnet run
```

The exact frontend/backend URLs may vary depending on the local development configuration.

---

## 📌 Project Status

### ✅ Completed

The main development of the Smart Study Planner has been completed and the application is currently running in the local development environment.

### 🚀 Next Step

**Deployment**

The next planned step is to deploy the application to a suitable hosting/cloud environment and configure it for production use.

---

## 🔮 Future Improvements

Possible future improvements include:

* Cloud deployment
* Production-ready database configuration
* Secure environment-variable management
* CI/CD integration
* Improved API testing
* Additional analytics and reporting
* Enhanced resource management
* Improved mobile responsiveness
* Additional student productivity features

---

## 🎯 Learning Outcomes

Through this project, the team gained practical experience in:

* Full-stack web development
* React and TypeScript
* ASP.NET Core Web API
* C#
* RESTful API development
* Entity Framework Core
* SQL Server
* Authentication and authorization
* JWT
* Docker and Docker Compose
* API testing with Swagger
* Git and GitHub collaboration
* Team-based software development

---

## 🔗 Repository

**GitHub:**
https://github.com/Bineeta123/Helpers

---

## 👥 Team

**Smart Study Planner** was developed as a collaborative college mini-project by:

* **Bineeta Khanal** — Backend Developer
* **Neha Khanal** — Frontend Developer
* **Khushi Ghimire** — Frontend Developer

---

## 📄 Project Information

**Project:** Smart Study Planner
**Type:** College Mini Project
**Architecture:** Full Stack Web Application
**Development Status:** Completed
**Deployment Status:** Not yet deployed
