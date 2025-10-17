# Development Guide

**Last Updated:** 2025-10-17

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Code Quality](#code-quality)
4. [Testing](#testing)
5. [Building & Deployment](#building--deployment)

---

## Prerequisites

- **Node.js** 18+ or 20+
- **npm** 9+
- **Cloudflare Account** (for deployment)
- **Wrangler CLI** (installed via npm)

---

## Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd sleep-mcp-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.dev.vars` file for local development:

```bash
AUTH_ISSUER=http://localhost:3000
AUTH_JWT_SECRET=$(openssl rand -base64 32)
AUTH_ENCRYPTION_KEY=$(openssl rand -base64 32)
AUTH_SESSION_SECRET=$(openssl rand -base64 32)
AUTH_CLIENTS_JSON='[{"clientId":"sleep-cli","redirectUris":["http://localhost:6274/oauth/callback"],"scopes":["sleep.read_device","sleep.write_temperature"],"isPublic":true}]'
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:6274
```

### 4. VS Code Setup (Recommended)

Install recommended extensions:
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- TypeScript Nightly (`ms-vscode.vscode-typescript-next`)

VS Code will prompt you to install these when you open the project.

---

## Code Quality

### Linting with ESLint

ESLint is configured with TypeScript support and Prettier integration.

**Configuration:** [eslint.config.js](../eslint.config.js)

#### Commands

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

#### Rules

- **Type Safety:** `@typescript-eslint/no-explicit-any` (warn)
- **Unused Variables:** Error (except variables prefixed with `_`)
- **Async/Promise:** Enforce proper `await` usage
- **Code Quality:** Enforce `const`, disallow `var`

#### Example: Fixing Unused Variables

```typescript
// ❌ Error: 'error' is defined but never used
try {
  doSomething();
} catch (error) {
  // Not using error
}

// ✅ Fix: Prefix with underscore
try {
  doSomething();
} catch (_error) {
  // Ignored
}
```

### Formatting with Prettier

Prettier auto-formats code on save in VS Code.

**Configuration:** [.prettierrc](../.prettierrc)

#### Settings

- **Print Width:** 100 characters
- **Tab Width:** 2 spaces
- **Quotes:** Single quotes
- **Semicolons:** Always
- **Trailing Commas:** ES5 style

#### Commands

```bash
# Check formatting (CI/CD)
npm run format:check

# Fix formatting
npm run format

# Combined check (format + lint)
npm run check
```

#### Manual Formatting

```bash
# Format specific file
npx prettier --write src/server.ts

# Format all TypeScript files
npm run format
```

### Pre-commit Hook (Optional)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run check
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Testing

### Unit Tests

Uses Vitest for testing.

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

---

## Building & Deployment

### Local Development

#### Option 1: Node.js Server (Streamable HTTP)

```bash
# Start MCP server locally
npm run server
```

Server runs at `http://localhost:3000/mcp`

#### Option 2: Cloudflare Worker (Local)

```bash
# Build TypeScript
npm run build

# Start local Worker
npm run dev:worker
```

Worker runs at `http://localhost:8787/mcp`

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

Output: `dist/` directory

### Deployment

#### Deploy to Cloudflare Workers (Dev)

```bash
# Deploy to dev environment
npm run deploy
```

#### Deploy to Production

```bash
# Deploy to production environment
npx wrangler deploy --env production
```

#### Set Cloudflare Secrets

```bash
# Set secrets (one-time setup)
npx wrangler secret put AUTH_JWT_SECRET
npx wrangler secret put AUTH_ENCRYPTION_KEY
npx wrangler secret put AUTH_SESSION_SECRET

# For production environment
npx wrangler secret put AUTH_JWT_SECRET --env production
```

### Verify Deployment

```bash
# Check deployment status
npx wrangler deployments list

# View live logs
npx wrangler tail
```

---

## Project Structure

```
sleep-mcp-server/
├── src/
│   ├── auth/              # OAuth & authentication
│   │   ├── config.ts      # Configuration loader
│   │   ├── credentialStorage.ts  # Encrypted credential storage
│   │   ├── http.ts        # OAuth HTTP handlers
│   │   ├── provider.ts    # Provider interface
│   │   ├── store.ts       # OAuth state/client storage
│   │   └── tokens.ts      # JWT generation/verification
│   ├── providers/
│   │   └── sleep/         # Eight Sleep provider
│   │       └── sleepProvider.ts
│   ├── client.ts          # Eight Sleep API client
│   ├── server.ts          # MCP server (Node.js)
│   ├── worker.ts          # Cloudflare Worker entry
│   └── cli.ts             # CLI tool
├── docs/                  # Documentation
│   ├── AUTH_FLOW.md       # Authentication flow
│   ├── DEVELOPMENT.md     # This file
│   └── security-hardening-plan.md
├── dist/                  # Build output (gitignored)
├── .vscode/               # VS Code settings
│   ├── settings.json      # Auto-format on save
│   └── extensions.json    # Recommended extensions
├── eslint.config.js       # ESLint configuration
├── .prettierrc            # Prettier configuration
├── tsconfig.json          # TypeScript configuration
├── wrangler.toml          # Cloudflare Worker config
└── package.json           # Dependencies & scripts
```

---

## Common Issues

### ESLint Errors

**Issue:** `Error: Cannot find module 'typescript-eslint'`

**Fix:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prettier Not Formatting

**Issue:** Code not auto-formatting on save

**Fix:**
1. Install Prettier extension in VS Code
2. Check `.vscode/settings.json` exists
3. Reload VS Code window

### TypeScript Errors

**Issue:** `Cannot find module '@modelcontextprotocol/sdk'`

**Fix:** Install dependencies
```bash
npm install
```

### Worker Deployment Fails

**Issue:** `Error: Authentication error`

**Fix:** Login to Wrangler
```bash
npx wrangler login
```

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Run checks: `npm run check`
4. Fix issues: `npm run lint:fix && npm run format`
5. Commit: `git commit -m "feat: add feature"`
6. Push: `git push origin feature/my-feature`
7. Create Pull Request

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Tooling/config changes

---

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

---

**Need Help?** Check [docs/AUTH_FLOW.md](./AUTH_FLOW.md) or open an issue.
