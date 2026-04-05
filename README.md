#  Project Management Backend API

 A full-stack ready backend system for managing projects, tasks, and team collaboration with authentication and role-based access control.  

---

##  Overview

This backend provides a RESTful API for:

* User authentication (JWT-based)
* Project management (owner & members)
* Task management (status, priority, assignment)
* Comment system (task-level collaboration)

---

##  Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt (password hashing)

---

##  Folder Structure

```
src/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
├── constants/
│
└── server.js
```

---

##  Authentication

* JWT-based authentication
* Token required in all protected routes

### Header Format:

```
Authorization: Bearer <token>
```

---

##  API Endpoints

###  Auth

```
POST   /api/auth/register
POST   /api/auth/login
```

---

###  Projects

```
POST   /api/projects
GET    /api/projects
POST   /api/projects/add-member
```

---

###  Tasks

```
POST   /api/tasks
GET    /api/tasks
PATCH  /api/tasks/:id
```

---

###  Comments

```
POST   /api/comments
GET    /api/comments/:taskId
```

---

##  Data Models

### User

* name
* email
* password
* role (default: member)

---

### Project

* name
* description
* color
* owner (User)
* members (Users)

---

### Task

* title
* description
* priority (low, medium, high)
* status (todo, in-progress, done)
* dueDate
* assignedTo (User)
* project (Project)

---

### Comment

* text
* task (Task)
* user (User)

---

##  Access Control Rules

* Only authenticated users can access APIs
* Project owner can add members
* Only project members can:

  * view tasks
  * create tasks
  * comment
* Tasks are scoped to projects

---

##  Getting Started

### 1. Clone the repository

```
git clone <your-repo-url>
cd backend
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Setup environment variables

Create a `.env` file:

```
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=your_client_url
```

---

### 4. Run the server

```
npm run dev
```

---

##  Testing

Use tools like:

* Postman

Test all endpoints with proper authentication.

---

##  Deployment

Recommended stack:

* Backend → Render 
* Database → MongoDB Atlas


---

##  Notes

* All responses follow a consistent structure:

  ```
  {
    "success": true,
    "data": {}
  }
  ```
* Errors:

  ```
  {
    "success": false,
    "message": "Error message"
  }
  ```

---

## 👨‍💻 Author

Piyush Khare

---
