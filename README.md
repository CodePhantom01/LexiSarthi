---

````md
# 📚 LexiSarthi

A full-stack **Hindi–English Vocabulary Learning Platform** designed to help users improve English vocabulary with **Hindi meanings, pronunciation, examples, synonyms, antonyms**, and **daily word emails**.

🔗 **Live App:** https://lexi-sarthi.vercel.app  
🔗 **Backend API:** https://lexisarthi-backend.onrender.com  
🔗 **GitHub Repository:** https://github.com/CodePhantom01/LexiSarthi  

---

## 🖼️ Screenshots

### Authentication
![Login](./screenshots/login.png)

### Word Details
![Word Details](./screenshots/word-details.png)

### Admin Panel
![Admin Panel](./screenshots/admin-panel.png)

---

## ✨ Features

- 🔍 English vocabulary with Hindi meanings
- 🔐 Secure JWT authentication (Login / Signup)
- 🧑‍💼 Admin panel for managing words
- 📧 Daily vocabulary emails using cron jobs
- 👤 User profile & email preferences
- 📱 Responsive UI built with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- React 19, Vite
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js, Express.js
- MongoDB Atlas, Mongoose
- JWT Authentication, Bcrypt
- Node-cron, Nodemailer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas or Local MongoDB

### Installation

```bash
git clone https://github.com/CodePhantom01/LexiSarthi.git
cd LexiSarthi
````

```bash
# Backend
cd backend
npm install
```

```bash
# Frontend
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

### Backend (`backend/.env.example`)

```env
PORT=5000
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
MONGODB_URI=your_mongodb_atlas_uri

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Frontend (`frontend/.env.example`)

```env
VITE_API_URL=https://lexisarthi-backend.onrender.com
VITE_ADMIN_EMAIL=admin@example.com
```

⚠️ **Never commit real credentials to GitHub.**
Reference: [https://docs.github.com/en/code-security](https://docs.github.com/en/code-security)

---

## ▶️ Running the Application

```bash
# Backend
npm run dev
```

```bash
# Frontend
npm run dev
```

---

## 📁 Project Structure

```
LexiSarthi/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── jobs/
│   │   └── services/
│   └── server.js
└── frontend/
    └── src/
        └── pages/
```

---

## 🔀 Authentication & Routing

* JWT token stored in `localStorage`
* Protected routes redirect unauthenticated users
* Admin routes secured on both frontend and backend

---

## 🔌 REST API Endpoints

### User Routes (`/api/users`)

* `POST /signup`
* `POST /login`
* `GET /profile`
* `PUT /updateProfile`
* `PATCH /enable-daily-email`
* `DELETE /deleteProfile`

### Word Routes (`/api/words`)

* `GET /getAllWords`
* `GET /searchWord/:word`
* `POST /addWord` *(Admin only)*
* `PUT /updateWord/:word` *(Admin only)*
* `DELETE /deleteWord/:word` *(Admin only)*

---

## 🔒 Security

* JWT-based authentication
* Password hashing using bcrypt
* Role-based admin authorization
* CORS configuration

Best practices:
[https://expressjs.com/en/advanced/best-practice-security.html](https://expressjs.com/en/advanced/best-practice-security.html)

---

## ⏰ Automated Emails

* Daily cron job runs at **9:00 AM**
* Sends vocabulary emails to subscribed users
* Implemented using `node-cron` and `nodemailer`

Reference:
[https://www.npmjs.com/package/node-cron](https://www.npmjs.com/package/node-cron)

---

## 🗄️ Database

* MongoDB Atlas (Cloud Database)
* Mongoose ODM
* Secure environment-based configuration

Docs:
[https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)

---

## 📌 Future Enhancements

* Audio pronunciation support
* Spaced repetition learning
* Mobile-first UI improvements

---

## ❤️ Built With MERN Stack

```
