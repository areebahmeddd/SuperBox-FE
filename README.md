# SuperBox Frontend

Web marketplace for the SuperBox platform, built with Next.js 16, React 19, TypeScript 5, and Tailwind CSS 4.

## Pages

| Route           | Description                                      |
|-----------------|--------------------------------------------------|
| `/`             | Landing page                                     |
| `/explore`      | Browse and search the MCP server registry        |
| `/server/[id]`  | Server detail: tools, security report, pricing   |
| `/my-servers`   | Authenticated user's published servers           |
| `/profile`      | User profile and account settings                |
| `/settings`     | Application preferences                          |
| `/playground`   | Interactive server testing (coming soon)         |

## Stack

| Package                                           | Version | Purpose                   |
|---------------------------------------------------|---------|---------------------------|
| [Next.js](https://nextjs.org)                     | 16      | Framework and routing     |
| [React](https://react.dev)                        | 19      | UI rendering              |
| [TypeScript](https://typescriptlang.org)          | 5       | Type safety               |
| [Tailwind CSS](https://tailwindcss.com)           | 4       | Styling                   |
| [Firebase](https://firebase.google.com)           | 12      | Authentication            |
| [Framer Motion](https://framer.com/motion)        | 12      | Animations                |
| [Base UI](https://base-ui.com)                    | 1       | Headless UI primitives    |
| [Razorpay](https://razorpay.com)                  | -       | Payment integration       |

## Project Structure

```text
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   ├── explore/          # Server browser with search
│   ├── server/[id]/      # Server detail page
│   ├── my-servers/       # User's published servers
│   ├── profile/          # User profile
│   ├── settings/         # App settings
│   └── playground/       # Interactive playground
├── components/           # Shared UI components
│   ├── header.tsx
│   ├── server-card.tsx
│   ├── server-detail.tsx
│   ├── server-tabs.tsx
│   ├── tool-card.tsx
│   ├── security-report.tsx
│   ├── publish-modal.tsx
│   ├── auth-modal.tsx
│   ├── paywall-modal.tsx
│   └── ui/               # Base UI primitives
├── lib/                  # Utilities and configuration
│   ├── firebase.ts       # Firebase client
│   ├── types.ts          # Shared type definitions
│   ├── utils.ts          # Helper functions
│   └── toast-utils.ts    # Toast notification helpers
├── styles/               # Global CSS
└── types/                # Third-party type declarations
```

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

NEXT_PUBLIC_GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

`NEXT_PUBLIC_API_URL` must point to a running instance of the Go backend. See [backend/docs/INSTALL.md](https://github.com/areebahmeddd/superbox.ai/blob/prod/backend/docs/INSTALL.md) for backend setup.

### 3. Run the development server

```bash
npm run dev
# Available at http://localhost:3000
```

### 4. Build for production

```bash
npm run build
npm start
```

## Docker

Build the image (environment variables are baked in at build time via `--build-arg`):

```bash
docker build -t superbox-fe:latest \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  .
```

Run:

```bash
docker run -d -p 3000:3000 --name superbox-fe --env-file .env superbox-fe:latest
```

## Documentation

Full frontend documentation: [https://superbox.1mindlabs.org/docs/frontend](https://superbox.1mindlabs.org/docs/frontend)

To run the Mintlify docs locally:

```bash
npm run docs
```
