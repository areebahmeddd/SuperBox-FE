# SuperBox Documentation Setup

Comprehensive Mintlify documentation for SuperBox - covering both frontend (Next.js) and backend (Go API + Python CLI) with interactive API documentation.

## ✅ What's Been Created

### 📚 Core Documentation

- **introduction.mdx** - Welcome page with feature overview
- **quickstart.mdx** - 5-minute getting started guide with code examples
- **architecture.mdx** - Complete system architecture with Mermaid diagrams

### 🔐 API Documentation

#### General API Docs
- **api/introduction.mdx** - API overview with endpoints, pagination, rate limiting
- **api/authentication.mdx** - Firebase JWT authentication flow and best practices
- **api/errors.mdx** - Comprehensive error codes and handling strategies

#### Servers API (Interactive Swagger-style)
- **api/servers/list.mdx** - GET /servers with filtering, sorting, pagination
- **api/servers/get.mdx** - GET /servers/:name with security reports
- **api/servers/create.mdx** - POST /servers with deployment workflow
- **api/servers/update.mdx** - PUT /servers/:name with version management
- **api/servers/delete.mdx** - DELETE /servers/:name with recovery process

### 🎨 Features

Each API endpoint documentation includes:
- ✅ Interactive code examples (cURL, JavaScript, Python, Go)
- ✅ Request/Response schemas with `<ParamField>` and `<ResponseField>`
- ✅ Multiple response examples (success, errors)
- ✅ Use cases and best practices
- ✅ Common errors and solutions
- ✅ Related endpoints

### 📋 Configuration

- **mint.json** - Complete Mintlify configuration
  - Navigation structure
  - API base URL configuration
  - Color scheme (red theme)
  - Tabs for API Reference
  - Footer socials

## 🚀 Running the Documentation

### Prerequisites

Mintlify requires **Node.js LTS** (18.x or 20.x). It does **not support Node 25+**.

```bash
# Check your Node version
node --version

# If on Node 25+, switch to LTS using nvm
nvm install 20
nvm use 20

# Or using volta
volta install node@20
```

### Start the Docs Server

```bash
# From project root
npm run docs

# Or manually
cd docs
mintlify dev
```

The documentation will be available at **http://localhost:3001**

### Development Workflow

1. **Next.js App**: `npm run dev` → http://localhost:3000
2. **Docs Server**: `npm run docs` → http://localhost:3001
3. Click "Docs" in navbar to access documentation

## 📦 Package Information

- **Mintlify**: v4.2.230 (installed as devDependency)
- **Added Script**: `"docs": "cd docs && mintlify dev"`

## 🎨 Customization Guide

### Update Branding

Edit `docs/mint.json`:

```json
{
  "name": "SuperBox",
  "logo": {
    "dark": "/logo/dark.svg",
    "light": "/logo/light.svg"
  },
  "colors": {
    "primary": "#ef4444",    // Main red
    "light": "#f87171",      // Light red
    "dark": "#dc2626"        // Dark red
  }
}
```

### Add Your Logos

Place logo files in `docs/public/logo/`:
- `dark.svg` - Logo for dark mode
- `light.svg` - Logo for light mode

Recommended size: 120x40px (3:1 ratio)

### Modify Navigation

Edit the `navigation` array in `docs/mint.json`:

```json
{
  "navigation": [
    {
      "group": "Getting Started",
      "pages": ["introduction", "quickstart"]
    },
    {
      "group": "API Documentation",
      "pages": ["api/introduction", "api/authentication"]
    }
  ]
}
```

### Add New Pages

1. Create new `.mdx` file in `docs/` directory
2. Add frontmatter:
   ```mdx
   ---
   title: 'Page Title'
   description: 'Page description'
   ---
   ```
3. Add to navigation in `mint.json`
4. Page appears automatically in sidebar

## 📖 Documentation Features Used

### Mintlify Components

- **`<Card>`** - Feature cards with icons
- **`<CardGroup>`** - Grid layouts
- **`<Accordion>`** - Collapsible content
- **`<AccordionGroup>`** - Multiple accordions
- **`<Tabs>`** - Tabbed content
- **`<Steps>`** - Step-by-step guides
- **`<CodeGroup>`** - Multi-language code examples
- **`<ParamField>`** - API parameter documentation
- **`<ResponseField>`** - Response schema documentation
- **`<ResponseExample>`** - Response examples with syntax highlighting
- **`<Warning>`**, **`<Note>`**, **`<Info>`**, **`<Tip>`**, **`<Check>`** - Callouts

### Mermaid Diagrams

Used in `architecture.mdx` for:
- System architecture diagrams
- Sequence diagrams
- Data flow visualizations

### Code Examples

Every API endpoint includes examples in:
- **cURL** (bash)
- **JavaScript** (Node.js/Browser)
- **Python** (requests library)
- **Go** (net/http)

## 🔧 Technical Details

### API Base URL

Configured in `mint.json`:
```json
{
  "api": {
    "baseUrl": "https://api.superbox.dev/api/v1",
    "auth": {
      "method": "bearer"
    }
  }
}
```

### Tech Stack Documented

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion

**Backend:**
- Go with Gin framework
- RESTful API
- AWS Lambda
- Amazon S3
- Firebase Auth
- Razorpay payments

### Security Features

- Firebase JWT authentication
- SonarCloud code quality
- GitGuardian secrets detection
- Bandit security audit (Python)

## 📝 Content Structure

```
docs/
├── mint.json                    # Configuration
├── introduction.mdx            # Landing page
├── quickstart.mdx              # Getting started
├── architecture.mdx            # System architecture
└── api/
    ├── introduction.mdx        # API overview
    ├── authentication.mdx      # Auth guide
    ├── errors.mdx              # Error handling
    └── servers/
        ├── list.mdx            # GET /servers
        ├── get.mdx             # GET /servers/:name
        ├── create.mdx          # POST /servers
        ├── update.mdx          # PUT /servers/:name
        └── delete.mdx          # DELETE /servers/:name
```

## 🚢 Deployment

### Deploy to Mintlify Cloud

1. Sign up at [mintlify.com](https://mintlify.com)
2. Connect GitHub repository
3. Set docs directory: `docs/`
4. Deploy automatically on push

### Custom Domain (Optional)

Add to `mint.json`:
```json
{
  "domain": "docs.superbox.dev"
}
```

## 🎯 Best Practices

### Writing Documentation

1. **Clear titles** - Use action verbs (Get, Create, Update)
2. **Code examples** - Always include working examples
3. **Error handling** - Document common errors
4. **Use cases** - Show practical applications
5. **Visual aids** - Use diagrams where helpful

### API Documentation

1. **Complete schemas** - Document all fields
2. **Multiple examples** - Show success and error cases
3. **Best practices** - Include tips and warnings
4. **Related endpoints** - Link to related docs

### Maintenance

1. **Keep in sync** - Update docs when API changes
2. **Version clearly** - Document API versioning
3. **Test examples** - Ensure code examples work
4. **Monitor feedback** - Add FAQs based on questions

## 🔗 Useful Links

- **Mintlify Docs**: https://mintlify.com/docs
- **Component Library**: https://mintlify.com/docs/components
- **Mermaid Diagrams**: https://mermaid.js.org/
- **MDX Syntax**: https://mdxjs.com/

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
mintlify dev --port 3002
```

### Hot Reload Not Working

```bash
# Restart the server
# Make sure you're in the docs directory
cd docs
mintlify dev
```

### Images Not Loading

- Place images in `docs/public/images/`
- Reference as `/images/filename.png`
- Use absolute paths, not relative

### Broken Links

- Use relative paths: `/api/introduction`
- Don't use `.mdx` extension in links
- Check `mint.json` navigation matches filenames

## 📊 Analytics (Optional)

Add Google Analytics to `mint.json`:

```json
{
  "analytics": {
    "ga4": {
      "measurementId": "G-XXXXXXXXXX"
    }
  }
}
```

## 🎉 Next Steps

1. ✅ Documentation is ready to use
2. 🎨 Customize branding (logo, colors)
3. 🖼️ Add screenshots and diagrams
4. 🚀 Deploy to Mintlify Cloud
5. 📢 Share with your team

## 💡 Tips

- Use `Cmd+K` (Mac) or `Ctrl+K` (Windows) for search
- Preview changes in real-time with `mintlify dev`
- Use syntax highlighting in code blocks
- Link between pages for better navigation
- Add meta descriptions for SEO

## 🌐 Production Deployment

### Option 1: Mintlify Hosting (Recommended)

1. Go to [mintlify.com](https://mintlify.com)
2. Sign up and connect your GitHub repo
3. Mintlify auto-detects the `docs/` directory
4. Your docs will be live at a custom URL

### Option 2: Self-Host

```bash
cd docs
mintlify build
# Deploy the built files to your hosting service
```

### Update the Redirect URL

Once deployed, update `src/app/docs/page.tsx`:

```typescript
const docsUrl = process.env.NODE_ENV === "production"
  ? "https://docs.superbox.ai" // Your actual docs URL
  : "http://localhost:3001";
```

## 📝 Adding New Pages

1. Create a new `.mdx` file in `docs/`
2. Add frontmatter:
   ```mdx
   ---
   title: 'Page Title'
   description: 'Page description'
   ---
   ```
3. Write content using Markdown + Mintlify components
4. Add to navigation in `mint.json`

## 🛠️ Mintlify Components

Use these components in your `.mdx` files:

- `<Card>`, `<CardGroup>` - Feature cards
- `<Accordion>`, `<AccordionGroup>` - Collapsible content
- `<Tabs>`, `<Tab>` - Tabbed content
- `<CodeGroup>` - Multi-language code examples
- `<Steps>`, `<Step>` - Step-by-step instructions
- `<Note>`, `<Tip>`, `<Warning>` - Callouts
- `<ParamField>`, `<ResponseField>` - API docs

## 📚 Resources

- [Mintlify Documentation](https://mintlify.com/docs)
- [Mintlify Components](https://mintlify.com/docs/components)
- [OpenAPI Support](https://mintlify.com/docs/api-playground/openapi)

## 🎉 You're All Set!

Your documentation is ready to go. Just make sure you're using Node LTS and run:

```bash
npm run docs
```

Then visit `http://localhost:3001` to see your beautiful documentation! 🚀
