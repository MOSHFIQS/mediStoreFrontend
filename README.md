
# 💊 MediStore — Frontend

### *Your Trusted Online Medicine Shop*

🔗 **Live Site:** [medi-store-frontend-sooty.vercel.app](https://medi-store-frontend-sooty.vercel.app)  
📂 **Frontend Repo:** [github.com/MOSHFIQS/mediStoreFrontend](https://github.com/MOSHFIQS/mediStoreFrontend)  
🔗 **Backend API:** [medi-store-teal.vercel.app/api](https://medi-store-teal.vercel.app/api)

</div>

---

## 📖 Overview

MediStore is a full-stack **over-the-counter (OTC) medicine e-commerce platform** that allows customers to browse, search, and purchase medicines online. The platform supports multiple roles — **Customer**, **Seller**, and **Admin** — each with a tailored dashboard and feature set.

---

## 🖥️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.1.4 | App Router framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Static type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first styling |
| [TanStack Query](https://tanstack.com/query) | 5.x | Server state management |
| [TanStack Form](https://tanstack.com/form) | 1.x | Form handling & validation |
| [Zod](https://zod.dev/) | 4.x | Schema validation |
| [Recharts](https://recharts.org/) | 3.x | Dashboard analytics charts |
| [Sonner](https://sonner.emilkowal.ski/) | 2.x | Toast notifications |
| [Lucide React](https://lucide.dev/) | 0.563 | Icon library |
| [Radix UI](https://www.radix-ui.com/) | Latest | Headless accessible components |
| [Embla Carousel](https://www.embla-carousel.com/) | 8.x | Product carousels |
| Context API | Built-in | Auth & global state |
| Fetch API | Built-in | Backend communication |

---

## ✨ Features

### 🌍 Public (No Login Required)

- Browse all available medicines
- Search medicines by name or keyword
- Filter by category and price range
- View detailed medicine pages (description, dosage, stock)

### 👤 Customer

- Register and log in securely
- Add items to cart and manage quantities
- Checkout with **Cash on Delivery**
- Track real-time order status
- View full order history
- Submit and view product reviews
- Manage profile and account settings
- In-app notifications

### 🏪 Seller

- Add, edit, and delete medicine listings
- Manage inventory and stock levels
- View incoming orders
- Update order fulfillment status

### 🛡️ Admin

- View dashboard statistics and analytics
- Manage and moderate users (ban / unban)
- Browse all medicines platform-wide
- View and monitor all orders
- Manage product categories

---

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/           # Public routes (home, medicines, about, contact)
│   ├── dashboard/          # Role-based dashboards (customer / seller / admin)
│   ├── cart/               # Shopping cart
│   ├── orders/             # Order tracking & history
│   ├── login/              # Authentication
│   └── register/
├── components/             # Reusable UI components
│   ├── ui/                 # Radix-based base components (Button, Input, etc.)
│   ├── shared/             # Navbar, Footer, NotificationBell, etc.
│   └── ...
├── context/                # React Context providers (AuthProvider, etc.)
├── lib/                    # Utility functions, API helpers
└── types/                  # Global TypeScript type definitions
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/MOSHFIQS/mediStoreFrontend.git
cd mediStoreFrontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=https://medi-store-teal.vercel.app/api

# JWT secret (must match backend)
JWT_SECRET=your_jwt_secret_here

# EmailJS credentials (for contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

> **Note:** Never commit `.env.local` to version control. Add it to `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🔐 Authentication

Authentication uses **JWT tokens** stored in cookies via `js-cookie`. The `AuthProvider` context exposes `user`, `login`, `logout`, and `loading` states globally across the app.

Protected routes check the user's role (`customer`, `seller`, `admin`) and redirect accordingly.

---

## 🧪 Linting

```bash
npm run lint
```

---

## 🚀 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push your fork to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
