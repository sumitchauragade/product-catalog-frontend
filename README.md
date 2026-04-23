This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# UA Store — Frontend

A full-stack e-commerce frontend built with Next.js 14, TypeScript, and Tailwind CSS.
Consumes the [Product Catalog API](https://github.com/sumitchauragade/product-catalog-api).

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios
- JWT Authentication (via cookies)

## Features
- Product listing with search and category filter
- Product detail page with order placement
- User registration and login
- JWT-based auth with protected routes
- Order history with status tracking
- Cancel orders with automatic stock restore
- Product reviews with star ratings
- Average rating aggregation per product

## Pages
| Route | Description |
|-------|-------------|
| `/` | Product listing with search and filter |
| `/products/[id]` | Product detail, order placement, reviews |
| `/auth/login` | Login page |
| `/auth/register` | Registration page |
| `/orders` | Order history with status tracker |
| `/profile` | User profile page |

## Architecture Decisions
- **App Router** — used Next.js 14 app directory for layout and page structure
- **Client components** — data fetching happens client-side since pages are user-specific
- **Auth Context** — global auth state managed via React Context, persisted in cookies
- **Axios interceptor** — JWT token automatically attached to every request via interceptor
- **CSS Variables** — consistent design tokens across all components without a component library

## Getting Started

### Prerequisites
- Node.js 18+
- [Product Catalog API](https://github.com/sumitchauragade/product-catalog-api) running on port 3000

### Installation
```bash
git clone https://github.com/sumitchauragade/product-catalog-frontend.git
cd product-catalog-frontend
npm install
```

### Environment Setup
Create a `.env.local` file: