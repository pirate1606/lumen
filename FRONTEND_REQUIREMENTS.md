# LUMEN Frontend Requirements & Setup Guide

## Project Overview
**LUMEN** (Localized Unified Medical ENgine for Triage) - A modern, multilingual, AI-powered healthcare assistant built with React, TypeScript, and TailwindCSS.

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Browser**: Modern browser with ES2020 support (Chrome 90+, Firefox 88+, Safari 14+)

### Recommended Requirements
- **Node.js**: Version 20.0.0 or higher (LTS)
- **RAM**: 8GB or higher
- **Storage**: 5GB free space
- **Browser**: Latest Chrome, Firefox, or Safari

## Package Manager
- **Primary**: pnpm (version 8.0.0 or higher)
- **Alternative**: npm (version 8.0.0 or higher) or yarn (version 1.22.0 or higher)

## Core Dependencies

### Production Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "express": "^5.1.0",
  "dotenv": "^17.2.1",
  "multer": "^2.0.2",
  "zod": "^3.25.76"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.9.2",
  "vite": "^7.1.2",
  "@vitejs/plugin-react-swc": "^4.0.0",
  "@types/react": "^18.3.23",
  "@types/react-dom": "^18.3.7",
  "@types/node": "^24.2.1",
  "tailwindcss": "^3.4.17",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.6",
  "vitest": "^3.2.4"
}
```

### UI Component Libraries
```json
{
  "@radix-ui/react-accordion": "^1.2.11",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-button": "^1.1.14",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-toast": "^1.2.14",
  "lucide-react": "^0.539.0"
}
```

### Animation & 3D Libraries
```json
{
  "framer-motion": "^12.23.12",
  "@react-three/fiber": "^8.18.0",
  "@react-three/drei": "^9.122.0",
  "three": "^0.176.0"
}
```

### Utility Libraries
```json
{
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "class-variance-authority": "^0.7.1",
  "date-fns": "^4.1.0",
  "react-hook-form": "^7.62.0",
  "@hookform/resolvers": "^5.2.1"
}
```

## Configuration Files

### Required Configuration Files
1. **`tsconfig.json`** - TypeScript configuration
2. **`tailwind.config.ts`** - TailwindCSS configuration
3. **`postcss.config.js`** - PostCSS configuration
4. **`vite.config.ts`** - Vite build configuration
5. **`components.json`** - Radix UI components configuration

### Environment Variables
Create a `.env` file in the root directory:
```bash
# Development Environment
NODE_ENV=development
VITE_APP_TITLE=LUMEN Healthcare Assistant

# API Configuration (if needed)
VITE_API_BASE_URL=http://localhost:8080/api

# Optional: Analytics and Monitoring
VITE_ANALYTICS_ID=your_analytics_id
```

## Installation & Setup

### Step 1: Prerequisites
```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Install pnpm globally
npm install -g pnpm

# Verify installations
node --version    # Should be >= 18.0.0
pnpm --version    # Should be >= 8.0.0
```

### Step 2: Clone & Setup Project
```bash
# Navigate to project directory
cd /path/to/LUMEN-OpenAIxNXTWave_Project

# Install dependencies
pnpm install

# Alternative package managers:
# npm install
# yarn install
```

### Step 3: Development Server
```bash
# Start development server
pnpm dev

# Alternative commands:
# npm run dev
# yarn dev
```

## Available Scripts

### Development
```bash
pnpm dev          # Start development server (port 8080)
pnpm typecheck    # Run TypeScript type checking
pnpm test         # Run Vitest tests
pnpm format.fix   # Format code with Prettier
```

### Build & Production
```bash
pnpm build        # Build for production
pnpm build:client # Build only frontend
pnpm build:server # Build only backend
pnpm start        # Start production server
```

## Project Structure

```
client/                   # React frontend application
├── components/           # Reusable UI components
│   ├── ui/              # Radix UI components
│   └── lumen/           # LUMEN-specific components
├── pages/                # Route components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── global.css            # Global styles and TailwindCSS

server/                   # Express backend (integrated)
├── routes/               # API endpoints
└── index.ts              # Server configuration

shared/                   # Shared TypeScript types
└── api.ts                # API interfaces

public/                   # Static assets
├── favicon.ico
├── favicon.svg
└── placeholder.svg
```

## Browser Support

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Polyfills
The project includes necessary polyfills for:
- ES2020 features
- Modern CSS properties
- Web APIs

## Development Tools

### Code Quality
- **TypeScript**: Static type checking
- **ESLint**: Code linting (if configured)
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework

### Build Tools
- **Vite**: Fast build tool and dev server
- **SWC**: Fast JavaScript/TypeScript compiler
- **PostCSS**: CSS processing
- **TailwindCSS**: Utility-first CSS framework

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 8080
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8080 | xargs kill -9
```

#### Dependency Issues
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
pnpm typecheck

# Clear TypeScript cache
rm -rf .tsbuildinfo
```

#### Build Failures
```bash
# Clear build cache
rm -rf dist/
pnpm build
```

## Performance Optimization

### Development
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components
- Optimized build times with SWC

### Production
- Tree shaking for unused code
- Code splitting for better caching
- Optimized bundle sizes
- Gzip compression support

## Security Considerations

### Frontend Security
- No sensitive data in client-side code
- Environment variables prefixed with `VITE_`
- Content Security Policy (CSP) ready
- XSS protection through React

### Development Security
- Local development only (no production secrets)
- Secure headers configuration
- CORS configuration for API endpoints

## Deployment

### Build for Production
```bash
# Create production build
pnpm build

# Build output location
dist/spa/          # Frontend static files
dist/server/       # Backend server files
```

### Deployment Platforms
- **Netlify**: Static site hosting
- **Vercel**: Full-stack deployment
- **AWS S3 + CloudFront**: Static hosting
- **Traditional hosting**: Upload `dist/spa/` contents

## Support & Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)

### Community
- [React Community](https://reactjs.org/community)
- [Vite Community](https://vitejs.dev/community)
- [TailwindCSS Community](https://tailwindcss.com/community)

---

**Note**: This project is a research prototype and does not replace professional medical advice. Always consult healthcare professionals for medical decisions.
