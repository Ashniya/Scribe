# ✍️ Scribe

> A modern, full-stack blogging and social platform built for writers and readers to connect, share ideas, and engage in real-time.

![Scribe Banner](https://via.placeholder.com/1200x400/10b981/ffffff?text=Scribe+-+Modern+Blogging+Platform)

## ✨ Unique Features

- **Rich Blogging Experience**: Write, edit, publish, and format beautiful blogs with a rich text editor.
- **Social Connectivity**: Follow your favorite authors, gain subscribers, and build your audience.
- **Real-Time Messaging**: Connect privately with other writers through instant, real-time direct messaging.
- **Interactive Engagement**: Like blogs, leave comments, and track your reading history and analytics.
- **Customizable Profiles**: Personalize your profile with avatars, cover images, bios, and integrated social links.
- **Dark Mode Ready**: A beautifully designed user interface that seamlessly switches between light and dark modes.
- **Responsive Design**: Flawless experience across desktops, tablets, and mobile devices.

## 🛠️ Tech Stack & Tools

Scribe is built using the **MERN** stack alongside powerful modern tools:

### Frontend
- **React (Vite)**: Lightning-fast frontend framework for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for highly customizable and responsive styling.
- **React Router**: For seamless, client-side single-page application (SPA) navigation.
- **Lucide React**: Beautiful, crisp iconography.

### Backend
- **Node.js & Express.js**: Robust and scalable server-side architecture.
- **MongoDB & Mongoose**: NoSQL database for flexible data modeling of users, blogs, and messages.
- **Socket.io**: WebSockets for powering the real-time private messaging system.

### Services & Integrations
- **Firebase Authentication**: Secure user authentication, handling both Email/Password and Google OAuth Sign-in.
- **Cloudinary**: Cloud storage and optimization for user avatars, cover photos, and blog images.

### Deployment
- **Vercel**: High-performance frontend hosting with automatic SPA routing.
- **Render**: Reliable backend hosting for the Express API and Socket.io server.

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js installed
- MongoDB URI
- Firebase Project configured
- Cloudinary Account

### 1. Clone the repository
```bash
git clone https://github.com/Ashniya/Scribe.git
cd Scribe
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env.backend` file with your credentials (MongoDB, Cloudinary). Add your Firebase `ScribeServiceAccountKey.json`.
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
```
Create a `.env.local` file with your Firebase config and API URL.
```bash
npm run dev
```

## 🤝 Developers

- **taniyasharma3132**
- **Ashniya**

## 📜 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
