# BookNook 📚

BookNook is an online book management and borrowing platform where users can explore books, add their own books, and manage their borrowing activities.

## 🌐 Live Website

[Visit BookNook]( https://booknook-client-blond.vercel.app )

## ✨ Features

- **User Authentication:** Register and log in using email and password or Google authentication.
- **Browse Books:** Explore all available books and filter them by category.
- **Book Details:** View detailed information about individual books.
- **Add Books:** Add new books with cover images and relevant information.
- **Manage My Books:** Edit or delete books added by the logged-in user.
- **Borrow Books:** Borrow available books and prevent duplicate borrowing.
- **My Borrows:** View borrowed books and their borrowing and return dates.
- **Return Books:** Return borrowed books and automatically update available copies.
- **Protected Routes:** Secure private pages and backend APIs using authentication and JWT verification.
- **Responsive Design:** Browse the application on desktop, tablet, and mobile devices.

## 🛠️ Technologies Used

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS
- shadcn/ui
- Better Auth

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (Jose)
- Multer
- ImgBB API

## ⚙️ Run Locally

### 1. Clone the frontend repository

```bash
git clone https://github.com/mahzamincodes/PH-B14-A08-BookNook-Client
cd booknook-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the frontend root and configure the required Better Auth, MongoDB, Google OAuth, and backend API URL environment variables.

### 4. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Start the backend

Clone the backend repository:

```bash
git clone https://github.com/mahzamincodes/PH-B14-A05-BookNook-Server
cd booknook-server
npm install
```

Configure the backend `.env` file with MongoDB credentials, ImgBB API key, Better Auth URL, and client URL.

Then run:

```bash
npm start
```

The backend runs on port `5000` by default.

## 👨‍💻 Developer

Developed as part of Programming Hero Assignment 08.
