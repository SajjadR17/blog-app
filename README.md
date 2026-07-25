<h1 align="center">✦ Ink & Field - A Minimal Editorial Blog Platform</h1>
<p align="center">
  <b>A quiet, editorial blog platform built with React, Firebase, and Firestore.</b><br>
  🌐 <a href="https://ink-field-blog-app.vercel.app/">Live Demo</a> •
  💾 <a href="https://github.com/SajjadR17/ink-field-blog-app.git">GitHub Repository</a>
</p>

---

# 📖 About The Project

Ink & Field is a minimal, editorial-style blog platform focused on slowing readers down rather than optimizing for scroll speed. It combines a public-facing reading experience — essays, short-form journal entries, and category browsing — with a full authentication system and an in-app admin panel for publishing new posts, no external CMS required.

The project was built to practice real-world full-stack React development: Firebase Authentication with role-based access control, Firestore as a live database, protected routes, optimistic UI patterns, and a from-scratch design system built entirely on CSS custom properties.

---

# ✨ Features

- 📝 Full essay reading experience with reading-time indicator
- 📓 Short-form journal entries, separate from long-form essays
- ❤️ Like system tied to individual user accounts
- 🔐 Email/password authentication (signup & login)
- 👤 Role-based access control (`admin` / `user`)
- ✍️ In-app admin panel to publish new posts (no CMS needed)
- 💾 Auto-saved drafts (persisted to `localStorage`, survives page reloads)
- 🌗 Light & dark mode with system preference detection
- 📱 Fully responsive design
- ⚡ Real-time data with Firestore, no backend server required

---

# 🌟 Highlights

- ✅ Clean, minimal editorial UI with a custom design system
- ✅ Role-based Firestore Security Rules
- ✅ Atomic writes with Firestore batched writes (`writeBatch`)
- ✅ Optimistic-friendly like/unlike logic
- ✅ Reusable, context-driven auth state (`AuthContext`, `ThemeContext`)
- ✅ Auto-generated slugs from post titles
- ✅ Clean and scalable folder structure

---

# 🛠️ Tech Stack

| Technology               | Usage                               |
| ------------------------ | ----------------------------------- |
| React.js                 | User Interface                      |
| React Router             | Client-side routing                 |
| Firebase Authentication  | User signup, login & sessions       |
| Firestore                | Posts, users, and likes database    |
| Vite                     | Build tool & dev server             |
| CSS3 (custom properties) | Theming, layout & responsive design |
| React Icons              | Icons                               |
| react-spinners           | Loading states                      |
| Netlify                  | Hosting & deployment                |

---

# 🗄️ Data Model

| Collection | Purpose                                                                                 |
| ---------- | --------------------------------------------------------------------------------------- |
| `posts`    | Essay/journal content — title, slug, excerpt, body, category, tags, readMins, likeCount |
| `users`    | Registered user profiles — email, username, role, liked post slugs                      |

---

# 🚀 Live Demo

🔗 https://ink-field-blog-app.vercel.app/

---

# 💻 Installation

```bash
git clone https://github.com/SajjadR17/ink-field-blog-app.git
cd ink-field-blog-app
npm install
npm run dev
```

You'll also need a Firebase project with **Firestore** and **Email/Password Authentication** enabled, and your config added to `firebase.js`.

---

# 📂 Project Structure

```text
src
│
├── assets/
├── components/      # Header, Footer, SideBar, LikeButton, etc.
├── contexts/         # AuthContext, ThemeContext
├── lib/                # auth.js, firestore helpers
├── pages/              # Essays, Journal, About, AddBlog, Login, Signup
├── styles/
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
