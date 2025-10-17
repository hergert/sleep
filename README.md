# Multi-Provider MCP Platform

A scalable Model Context Protocol (MCP) server platform supporting multiple third-party API integrations with OAuth authentication, deployed on Cloudflare Workers.

## 🌟 Features

- **Multi-Provider Architecture** - Easily add new API providers with minimal code
- **OAuth 2.0 Authentication** - Secure token management with refresh rotation
- **Cloudflare Workers Deployment** - Serverless, globally distributed
- **MCP Protocol Compliance** - Full support for tools, resources, and prompts
- **TypeScript** - Type-safe throughout
- **Per-Provider Isolation** - Separate workers, scopes, and credentials

## 📦 Current Providers

### 🛏️ Sleep (Eight Sleep)
Monitor and control your Eight Sleep mattress.

**Available Tools:**
- `get_device_status` - Real-time device temperature and bed presence
- `set_temperature` - Adjust heating/cooling levels
- `get_sleep_trends` - Historical sleep metrics and scores
- `get_sleep_intervals` - Detailed sleep session data

**Resources:**
- `sleep://sleep/{date}` - Sleep data for specific date
- `sleep://trends/{from}/{to}` - Sleep trends over date range

**Prompts:**
- `analyze_sleep` - AI-guided sleep pattern analysis

### 🏋️ Fitness (Tonal)
Access your Tonal workout history and exercise library.

**Available Tools:**
- `fitness_get_user_profile` - User profile and preferences
- `fitness_list_sessions` - Workout history (paginated)
- `fitness_list_movements` - Exercise catalog (304 movements)
- `fitness_create_session` - Create custom workouts

**Resources:**
- `fitness://user/profile` - Cached user profile
- `fitness://sessions/{offset}/{limit}` - Paginated workouts

**Prompts:**
- `workout_analyze_sessions` - AI-guided workout analysis

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
# Clone repository
git clone <repo-url>
cd salute

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Environment Variables

Create a `.env` file with your credentials:

```bash
# Sleep Provider (Eight Sleep)
SLEEP_EMAIL=your-email@example.com
SLEEP_PASSWORD=your-password

# Fitness Provider (Tonal)
FITNESS_EMAIL=your-tonal-email@example.com
FITNESS_PASSWORD=your-tonal-password

# Auth Secrets (generate with: openssl rand -base64 32)
AUTH_ENCRYPTION_KEY=<base64-encoded-key>
AUTH_SESSION_SECRET=<base64-encoded-secret>
AUTH_JWT_SECRET=<base64-encoded-secret>
AUTH_CLIENTS_JSON='[{"id":"test-client","name":"Test Client","redirect_uris":["http://localhost:3000/callback"]}]'
```

### Local Development

**Run Sleep MCP Server:**
```bash
npm run sleep:server
# Server starts on http://localhost:3000
```

**Run Fitness MCP Server:**
```bash
npm run fitness:server
# Server starts on http://localhost:3001
```

**Test with CLI:**
```bash
# Sleep commands
npm run cli sleep:auth
npm run cli sleep:profile
npm run cli sleep:trends 2025-01-01 2025-01-07

# Fitness commands
npm run cli fitness:auth
npm run cli fitness:profile
npm run cli fitness:workouts 0 10

# Save responses to files
npm run cli fitness:movements --file movements.json
```

## 🔧 CLI Usage

The CLI supports both providers with a clean command structure:

```bash
# Sleep Provider
npm run cli sleep:auth                      # Authenticate
npm run cli sleep:profile                   # Get user profile
npm run cli sleep:device <deviceId>         # Get device status
npm run cli sleep:temp <level> <duration>   # Set temperature (-100 to 100)
npm run cli sleep:trends <from> <to> [tz]   # Get sleep trends (YYYY-MM-DD)
npm run cli sleep:intervals                 # Get detailed intervals

# Fitness Provider
npm run cli fitness:auth                    # Authenticate
npm run cli fitness:profile                 # Get user profile
npm run cli fitness:workouts [offset] [limit] # List workouts (default: 0, 20)
npm run cli fitness:movements               # List all movements

# General
npm run cli help                            # Show help menu
npm run cli <command> --file <path>         # Save JSON response to file
```

## ☁️ Cloudflare Workers Deployment

### Setup

1. **Install Wrangler:**
```bash
npm install -g wrangler
wrangler login
```

2. **Configure Secrets:**
```bash
# Set required secrets for Sleep worker
npx wrangler secret put AUTH_ENCRYPTION_KEY
npx wrangler secret put AUTH_SESSION_SECRET
npx wrangler secret put AUTH_JWT_SECRET
npx wrangler secret put AUTH_CLIENTS_JSON
npx wrangler secret put AUTH_ISSUER
```

3. **Deploy:**
```bash
# Deploy Sleep MCP server
npm run build
npx wrangler deploy

# Deploy Fitness MCP server
npx wrangler deploy --config wrangler-fitness.toml
```

### Configuration

**Sleep Worker** (`wrangler.toml`):
- Name: `sleep-mcp-server`
- Main: `dist/sleep-worker.js`
- KV Namespaces: OAuth state, clients, credentials

**Fitness Worker** (`wrangler-fitness.toml`):
- Name: `fitness-mcp-server`
- Main: `dist/fitness-worker.js`
- Same KV namespaces (shared auth infrastructure)

## 🏗️ Architecture

```
src/
├── platform/           # Reusable platform code
│   ├── auth/          # OAuth 2.0 implementation
│   ├── mcp/           # MCP server factory
│   └── cloudflare/    # Workers adapter
├── providers/         # Provider-specific implementations
│   ├── sleep/
│   │   ├── authProvider.ts   # Eight Sleep OAuth
│   │   ├── client.ts         # API client
│   │   ├── context.ts        # Auth context helpers
│   │   └── tools.ts          # MCP tools/resources/prompts
│   └── fitness/
│       ├── authProvider.ts   # Tonal Auth0
│       ├── client.ts         # API client
│       ├── context.ts        # Auth context helpers
│       └── tools.ts          # MCP tools/resources/prompts
└── workers/           # Worker entry points
    ├── sleep/
    │   └── entry.ts   # Sleep worker bootstrap
    └── fitness/
        └── entry.ts   # Fitness worker bootstrap
```

### Key Design Principles

1. **Platform Abstraction** - Auth, MCP, and Workers logic is provider-agnostic
2. **Provider Isolation** - Each provider has independent auth and tools
3. **Minimal Entry Points** - Workers are ~50 lines of glue code
4. **Type Safety** - Full TypeScript coverage
5. **Security First** - Per-grant key derivation, refresh token rotation

## 🔐 Security

- **OAuth 2.0 PKCE** - Authorization code flow with proof key
- **Per-Grant Encryption** - Unique AES keys derived per user+provider+client
- **Refresh Token Rotation** - Previous + current hash stored, auto-rotation
- **Encrypted Credentials** - KV storage with AES-256-GCM encryption
- **Scope Enforcement** - Fine-grained permissions per provider
- **Secret Management** - Cloudflare Workers secrets (not in code)

## 📚 Adding a New Provider

1. **Create Provider Structure:**
```bash
mkdir -p src/providers/newprovider
touch src/providers/newprovider/{authProvider,client,context,tools,types}.ts
```

2. **Implement `AuthenticationProvider`:**
```typescript
// src/providers/newprovider/authProvider.ts
export class NewProviderAuthProvider implements AuthenticationProvider<NewProviderClient> {
  readonly id = 'newprovider';
  readonly displayName = 'New Provider';
  readonly defaultScopes = ['read', 'write'];

  async authenticate(email: string, password: string): Promise<AuthenticationResult> {
    // Implement authentication logic
  }

  async createClient(credentials: CredentialPayload): Promise<NewProviderClient> {
    // Recreate client from stored credentials
  }
}
```

3. **Create API Client:**
```typescript
// src/providers/newprovider/client.ts
export class NewProviderClient {
  async authenticate(email: string, password: string) { /* ... */ }
  async getSomeData() { /* ... */ }
}
```

4. **Register MCP Tools:**
```typescript
// src/providers/newprovider/tools.ts
export const registerNewProviderHandlers = (server: Server) => {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'newprovider_get_data',
        description: 'Get data from new provider',
        inputSchema: { /* ... */ },
      }
    ]
  }));

  server.setRequestHandler(CallToolRequestSchema, async ({ params }, extra) => {
    return await withNewProviderClient(extra, async ({ client }) => {
      const data = await client.getSomeData();
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    });
  });
};
```

5. **Create Worker Entry:**
```typescript
// src/workers/newprovider/entry.ts
import { createMcpServer } from '../../platform/mcp/server.js';
import { createWorkerHandler } from '../../platform/cloudflare/worker.js';
import { NewProviderAuthProvider } from '../../providers/newprovider/authProvider.js';
import { registerNewProviderHandlers } from '../../providers/newprovider/tools.js';
// Import platform auth helpers...

const authProvider = new NewProviderAuthProvider();
const server = createMcpServer({
  serverInfo: { name: 'newprovider-mcp-server', version: '1.0.0' },
  protocolVersion: '2025-06-18',
});

registerNewProviderHandlers(server);

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined,
  enableJsonResponse: true,
});

await server.connect(transport);

export default createWorkerHandler({
  auth: { provider: authProvider, /* ... */ },
  server,
  transport,
});
```

6. **Add CLI Commands:**
```typescript
// src/cli.ts - Add commands like:
else if (command === 'newprovider:auth') {
  await authenticateNewProvider();
}
```

7. **Create Wrangler Config:**
```toml
# wrangler-newprovider.toml
name = "newprovider-mcp-server"
main = "dist/newprovider-worker.js"
# Copy KV bindings from wrangler.toml
```

That's it! The platform handles OAuth, MCP wiring, and Workers deployment.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run build
```

## 📖 Documentation

- [Eight Sleep API](docs/8sleep.md) - Complete API reference
- [Tonal API](docs/fitness-tonal.md) - Complete API reference
- [Auth Flow](docs/AUTH_FLOW.md) - OAuth implementation details
- [Development](docs/DEVELOPMENT.md) - Development guide
- [Platform Scaffolding Plan](docs/specs/mcp-platform-scaffolding-plan.md) - Architecture design

## 🔄 MCP Protocol Compliance

This server implements the [Model Context Protocol](https://modelcontextprotocol.io/) specification:

- ✅ **Tools** - Callable functions with typed inputs/outputs
- ✅ **Resources** - URIs for on-demand context fetching
- ✅ **Resource Templates** - Parameterized resource URIs
- ✅ **Prompts** - Pre-defined prompt templates
- ✅ **Argument Completions** - Autocomplete for arguments
- ✅ **Structured Content** - Typed responses for LLM consumption
- ✅ **OAuth 2.0** - Standard authentication flow
- ✅ **Stateless Transport** - Compatible with serverless environments

## 🛠️ Development Scripts

```bash
npm run build              # Build TypeScript
npm run sleep:server       # Run Sleep MCP server locally
npm run fitness:server     # Run Fitness MCP server locally
npm run cli                # Interactive CLI
npm test                   # Run tests
npm run lint               # Lint code
npm run format             # Format code with Prettier
npm run format:check       # Check formatting
```

## 📊 API Response Samples

Sample API responses are saved in `docs/api-samples/`:

**Sleep:**
- `sleep_trends.json` (8.8KB) - Weekly sleep metrics
- `sleep_intervals.json` (251KB) - Detailed session timeseries
- `device_status.json` (4.5KB) - Real-time device state

**Fitness:**
- `fitness-profile.json` (2.1KB) - User profile data
- `fitness-workouts.json` (17KB) - Workout history
- `fitness-movements.json` (699KB) - Exercise catalog (304 movements)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This project uses reverse-engineered APIs from Eight Sleep and Tonal. These are **not official APIs** and are **not supported or endorsed** by either company. Use at your own risk.

- Eight Sleep may change their API at any time
- Tonal may change their API or block access
- Your account could be suspended for API usage
- No warranty or guarantee of functionality

For official integrations, contact the respective companies.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- [Eight Sleep](https://www.eightsleep.com/) for sleep tracking
- [Tonal](https://www.tonal.com/) for fitness tracking
- [ts-tonal-client](https://github.com/dlwiest/ts-tonal-client) for Tonal API research

## 📧 Contact

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ using TypeScript, Cloudflare Workers, and MCP**
