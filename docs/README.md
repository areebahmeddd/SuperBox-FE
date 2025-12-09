# SuperBox Documentation

Comprehensive interactive documentation for SuperBox - the MCP registry and sandbox platform.

## 📚 Documentation Structure

```
docs/
├── introduction.mdx          # Platform overview
├── quickstart.mdx           # 5-minute getting started
├── architecture.mdx         # System architecture
│
├── frontend/                # Next.js frontend docs
│   ├── overview.mdx
│   ├── setup.mdx
│   ├── components.mdx
│   └── deployment.mdx
│
├── backend/                 # Go + Python backend docs  
│   ├── overview.mdx
│   ├── setup.mdx
│   ├── architecture.mdx
│   └── deployment.mdx
│
├── concepts/                # Core concepts
│   ├── mcp-servers.mdx
│   ├── sandboxes.mdx
│   └── security.mdx
│
├── api/                     # REST API reference
│   ├── introduction.mdx
│   ├── authentication.mdx
│   ├── errors.mdx
│   ├── servers/            # Servers API
│   │   ├── list.mdx
│   │   ├── get.mdx
│   │   ├── create.mdx
│   │   ├── update.mdx
│   │   └── delete.mdx
│   ├── auth/               # Auth API
│   │   ├── register.mdx
│   │   ├── login.mdx
│   │   ├── oauth.mdx
│   │   ├── device-flow.mdx
│   │   └── profile.mdx
│   └── payment/            # Payment API
│       ├── create-order.mdx
│       ├── verify.mdx
│       └── status.mdx
│
└── cli/                     # CLI reference
    ├── introduction.mdx
    ├── installation.mdx
    ├── init.mdx
    ├── auth.mdx
    ├── push.mdx
    ├── pull.mdx
    ├── run.mdx
    ├── search.mdx
    ├── inspect.mdx
    └── test.mdx
```

## 🚀 Running the Docs

### Prerequisites

**Important:** Mintlify requires Node.js LTS (18.x or 20.x). It does NOT support Node 25+.

Switch to Node 20:
```bash
# Using nvm
nvm install 20
nvm use 20

# Using volta
volta install node@20
```

### Start Documentation Server

```bash
# From project root
npm run docs

# Or from docs directory
cd docs
mintlify dev
```

Documentation will be available at `http://localhost:3001`

## 📖 What's Included

### Interactive API Documentation
- **Swagger-like interface** with request/response examples
- **4 programming languages**: cURL, JavaScript, Python, Go
- **Live examples** with copy-paste ready code
- **Error scenarios** with solutions

### Comprehensive Guides
- **Frontend**: Next.js 16 setup, components, deployment
- **Backend**: Go API + Python CLI setup and architecture
- **CLI**: All 8 commands with examples and options
- **Concepts**: MCP servers, sandboxes, security pipeline

### API Endpoints Documented
- **Servers**: CRUD operations with filtering/sorting
- **Auth**: Register, login, OAuth, device flow, profile management
- **Payment**: Razorpay integration (order, verify, status)

## 🎨 Mintlify Components Used

All documentation uses Mintlify's interactive components:
- `<Card>` & `<CardGroup>` - Feature cards
- `<Accordion>` & `<AccordionGroup>` - Collapsible sections
- `<Tabs>` & `<Tab>` - Multi-option content
- `<Steps>` - Sequential guides
- `<CodeGroup>` - Multi-language code examples
- `<ParamField>` - API parameter docs
- `<ResponseField>` - API response docs
- `<ResponseExample>` - Example responses
- `<Warning>`, `<Note>`, `<Tip>`, `<Check>` - Callouts
- Mermaid diagrams for architecture

## 🔧 Customization

### Update Branding

Edit `docs/mint.json`:
```json
{
  "name": "SuperBox",
  "colors": {
    "primary": "#ef4444",
    "light": "#f87171",
    "dark": "#dc2626"
  }
}
```

### Add Logo

Place your logo files in `docs/public/logo/`:
- `dark.svg` - Dark mode logo
- `light.svg` - Light mode logo

### Modify Navigation

Edit the `navigation` section in `docs/mint.json`

## 🌐 Deployment

### Option 1: Mintlify Hosting (Recommended)

1. Go to [mintlify.com](https://mintlify.com)
2. Connect your GitHub repository
3. Mintlify auto-detects the `docs/` directory
4. Your docs will be live with a custom URL

### Option 2: Vercel/Netlify

Deploy as a static site:
```bash
cd docs
mintlify build
# Deploy the built files
```

### Update Frontend Redirect

Once deployed, update `src/app/docs/page.tsx`:
```typescript
const docsUrl = process.env.NODE_ENV === "production"
  ? "https://docs.superbox.ai" // Your docs URL
  : "http://localhost:3001";
```

## 📝 Adding New Pages

1. Create a new `.mdx` file in the appropriate directory
2. Add frontmatter:
   ```mdx
   ---
   title: 'Page Title'
   description: 'Page description'
   ---
   ```
3. Write content using Markdown + Mintlify components
4. Add to `mint.json` navigation

## 🎯 Features

### API Documentation
- Full REST API reference for all endpoints
- Authentication flows (JWT, OAuth, Device Flow)
- Payment integration (Razorpay)
- Request/response schemas
- Error handling examples

### CLI Documentation
- All 8 CLI commands
- Installation guide
- Usage examples with options
- Configuration guides

### Platform Documentation
- Frontend (Next.js) setup and components
- Backend (Go + Python) architecture
- MCP server concepts
- Security pipeline details
- Deployment guides

## 🔗 Links

- **Base API URL**: `https://api.superbox.ai/api/v1`
- **Frontend**: `https://superbox-fe.vercel.app`
- **GitHub**: `https://github.com/areebahmeddd/superbox.ai`

## 📧 Support

- **Email**: hi@areeb.dev
- **GitHub Issues**: [Report issues](https://github.com/areebahmeddd/superbox.ai/issues)
- **Discord**: Join our community (link coming soon)

## 📊 Documentation Stats

- **Total Pages**: 39 MDX files
- **API Endpoints**: 18 documented
- **CLI Commands**: 8 documented
- **Code Examples**: 150+ across all languages
- **Diagrams**: 10+ Mermaid diagrams

## 🎉 You're All Set!

Run `npm run docs` and visit `http://localhost:3001` to see your interactive documentation! 🚀
