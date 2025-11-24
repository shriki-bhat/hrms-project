# Human Resource Management System (HRMS)

A full-stack web application for managing employees, teams, and HR analytics built with the MERN stack.

## 🚀 Features

- **User Authentication** - Secure login and registration system
- **Employee Management** - Create, read, update, and delete employee records
- **Team Management** - Organize employees into teams
- **Analytics Dashboard** - View HR metrics and insights
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js
- Express.js
- MySQL (TiDB Cloud)
- JWT Authentication

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL database

### Backend Setup
cd backend
npm install


Create a `.env` file in the backend directory:
DB_HOST=your_database_host
DB_PORT=4000
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
PORT=5000
JWT_SECRET=your_jwt_secret


Run the backend:
npm start


### Frontend Setup
cd frontend
npm install


Create a `.env` file in the frontend directory:
REACT_APP_API_URL=http://localhost:5000


Run the frontend:
npm start


## 🌐 Live Demo

- **Frontend**: https://hrms-frontend-fn4b.onrender.com
- **Backend**: https://hrms-backend-6y82.onrender.com

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Analytics
- `GET /api/analytics` - Get HR analytics data

## 👤 Author

**Shriki Bhat**
- GitHub: [@shriki-bhat](https://github.com/shriki-bhat)

## 📄 License

This project is open source and available under the MIT License.


Save this to your project root directory and push:
git add README.md
git commit -m "Add README"
git push origin main
