<h1 align="center">✦ Ink & Field - A Minimal Editorial Blog Platform</h1>

<p align="center">
  <b>A quiet, editorial blog platform built with React, Firebase, and Firestore.</b><br>
  🌐 <a href="https://ink-field-blog-app.vercel.app/">Live Demo</a> •
  💾 <a href="https://github.com/SajjadR17/blog-app.git">GitHub Repository</a>
</p>

---

# 📖 About The Project

Ink & Field is a minimal editorial-style blog platform focused on slowing readers down rather than optimizing for endless scrolling. It combines a clean reading experience—long-form essays, short journal entries, and category browsing—with a complete authentication system and an in-app admin panel for publishing new content without relying on an external CMS.

The project was built to practice real-world React development using Firebase Authentication, Firestore, role-based access control, optimistic UI updates, profile management, and a fully custom design system built with CSS custom properties.

---

# ✨ Features

- 📄 Multiple pages (Essays, Journal, About, Add Blog, Profile, Login, Signup, Essay)
- 📝 Full essay reading experience
- ❤️ Like and 🔖 Bookmark essays
- 📓 Separate journal section for short-form entries
- 🔐 Email/Password & Google Authentication
- 👤 Role-based access control (`admin` / `user`)
- ✍️ Built-in admin panel for publishing blogs (no CMS required)
- 💾 Auto-saved drafts using `localStorage`
- 👤 Fully featured profile page
- 📱 Responsive design across desktop and mobile
- ⚡ Real-time Firestore updates

---

# 🌟 Highlights

- ✅ Clean editorial-inspired UI with a custom design system
- ✅ Role-based Firestore Security Rules
- ✅ Atomic Firestore writes using `writeBatch`
- ✅ Optimistic-friendly Like & Bookmark interactions
- ✅ Context-driven authentication (`AuthContext`)
- ✅ Automatic slug generation from post titles
- ✅ Scalable folder structure
- ✅ Protected routes for authenticated users
- ✅ Secure reauthentication for sensitive account actions

---

# 👤 Profile Features

The profile page provides a complete account management experience.

- 📝 Edit username
- 📧 Change email address (requires reauthentication)
- 🖼️ Upload, crop, replace, or remove profile picture
- ❤️ View all liked essays
- 🔖 View all bookmarked essays
- ❌ Remove liked or bookmarked posts directly from the profile
- 👥 View follower and following counts
- 📊 Display profile statistics (Likes, Bookmarks, Followers, Following)
- 🗑️ Permanently delete account (requires password reauthentication)

For security, changing the email address and deleting an account both require the user to reauthenticate by entering their password.

---

# 🛠️ Tech Stack

| Technology               | Usage                     |
| ------------------------ | ------------------------- |
| React.js                 | User Interface            |
| React Router             | Client-side routing       |
| Firebase Authentication  | Authentication & Sessions |
| Firestore                | Database                  |
| Cloudinary               | Profile image storage     |
| Vite                     | Build tool & Dev server   |
| CSS3 (Custom Properties) | Styling & Design System   |
| React Icons              | Icons                     |
| React Easy Crop          | Profile image cropping    |
| React Spinners           | Loading states            |
| Vercel                   | Deployment                |

---

# 🗄️ Data Model

| Collection | Purpose                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------- |
| `posts`    | Essay content (title, slug, excerpt, body, category, tags, readMins, like count, bookmark count)  |
| `users`    | User profiles, roles, likes, bookmarks, followers, following, profile information                 |
| `Journal`  | Journal entries (mood, content, date)                                                             |

---

# 💻 Installation

```bash
git clone https://github.com/SajjadR17/blog-app.git
cd ink-field-blog-app
npm install
npm run dev
```

You'll also need:

- A Firebase project
- Firestore enabled
- Email/Password Authentication enabled
- Google Authentication enabled
- Your Firebase configuration inside `firebase.js`
- A Cloudinary account with your API credentials

---

# 📂 Project Structure

```text
src
│
├── components/      # Reusable UI components
├── contexts/        # AuthContext
├── lib/             # Firebase helpers
├── pages/           # Application pages
├── styles/          # CSS files
├── utils/           # Utility functions
├── App.jsx
└── main.jsx
```

---

## 📄 License

All Rights Reserved.

This source code may not be copied, modified, distributed, or used for commercial purposes without explicit permission from the author.

© 2026 Sajjad Roohandeh

---

<h3 align="center">
Made with ❤️ by <b>Sajjad Roohandeh</b>
</h3>
