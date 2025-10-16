# End-to-End Testing Guide: OAuth Flow with Claude Desktop

This guide walks you through testing the complete OAuth 2.0 authorization flow using Claude Desktop as the MCP client.

## Overview

The flow consists of:
1. **Claude Desktop** (MCP Client) - Connects via HTTP transport
2. **Your MCP Server** (Authorization Server + Resource Server) - Runs locally on port 3000
3. **Sleep API** (External Identity Provider) - Validates user credentials

## Prerequisites

- Node.js installed
- Claude Desktop installed
- Valid Sleep account credentials (email/password)
- Project built (`npm run build`)

## Step 1: Configure Environment Variables

Create/verify your `.env` file in the project root:

```bash
# OAuth Configuration
AUTH_JWT_SECRET=47f30fee251bd4bcf01ce23a6a1bbbd0645559f95be90576875d5300b85d7834
AUTH_ENCRYPTION_KEY=4FSobGyHFoTZ8BDbbuaYWijNfwIaqIyA1SNnQykwAAg=
AUTH_SESSION_SECRET=e78ab98559296a819918b4686fcbfed31bed164dac925f94c2ff7c088f042636

# Server Configuration
SLEEP_TIMEZONE=America/Los_Angeles  # Or your timezone
MCP_ENABLE_DNS_PROTECTION=false     # For local testing

# OAuth Client Configuration (must match Claude Desktop config)
AUTH_CLIENTS='[{"id":"claude-desktop","name":"Claude Desktop","scopes":["sleep.read_device","sleep.read_trends","sleep.write_temperature"],"redirectUris":["http://localhost:3000/oauth/callback"]}]'
```

**Security Note**: These are development secrets. Rotate before production.

## Step 2: Start the MCP Server

```bash
npm run build
npm run server
```

You should see:
```
[mcp] Listening on http://localhost:3000
[mcp] MCP endpoint: http://localhost:3000/mcp
[mcp] OAuth authorize: http://localhost:3000/authorize
[mcp] OAuth token: http://localhost:3000/token
```

## Step 3: Configure Claude Desktop

### Option A: Using MCP Inspector (Recommended for Testing)

The `inspector.config.json` file is already set up:

```json
{
  "servers": [
    {
      "name": "Sleep MCP",
      "transport": {
        "type": "streamable-http",
        "url": "http://localhost:3000/mcp"
      }
    }
  ]
}
```

Run the MCP Inspector:
```bash
npx @modelcontextprotocol/inspector inspector.config.json
```

This opens a browser UI where you can test the OAuth flow interactively.

### Option B: Configure Claude Desktop Directly

Edit your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

Add this server configuration:

```json
{
  "mcpServers": {
    "sleep-mcp": {
      "transport": {
        "type": "streamable-http",
        "url": "http://localhost:3000/mcp",
        "oauth": {
          "authorizationUrl": "http://localhost:3000/authorize",
          "tokenUrl": "http://localhost:3000/token",
          "clientId": "claude-desktop",
          "scopes": ["sleep.read_device", "sleep.read_trends", "sleep.write_temperature"]
        }
      }
    }
  }
}
```

**Important**: Restart Claude Desktop after editing the config.

## Step 4: Test the OAuth Flow

### Using MCP Inspector

1. Open the Inspector UI (http://localhost:5173 by default)
2. Click **"Connect"** next to "Sleep MCP"
3. You'll be redirected to the authorization page
4. Enter your Sleep account credentials
5. Click **"Continue"** to approve
6. You'll be redirected back to the Inspector
7. Test the tools: `get_device_status`, `get_sleep_trends`, etc.

### Using Claude Desktop

1. Open Claude Desktop
2. Start a new conversation
3. Claude will detect the new MCP server and prompt for authorization
4. A browser window will open to `http://localhost:3000/authorize`
5. Enter your Sleep email and password
6. Click **"Continue"** to authorize access
7. Browser redirects back to Claude Desktop
8. Try a command: "What's my sleep device status?"

## Step 5: Verify the Flow

### Check Server Logs

You should see logs like:

```
[mcp] GET /authorize - 200
[mcp] POST /authorize - 302 (redirect to callback)
[mcp] POST /token - 200 (token exchange)
[mcp] Sleep account persisted for subject: user-abc123
```

### Test Tool Calls

In Claude Desktop or Inspector, try:

```
"Get my device status"
"Show my sleep trends from last week"
"Set my bed temperature to 2"
```

### Verify Token Storage

Tokens are encrypted in memory. To verify storage is working:

```bash
# In a new terminal, check server is running
curl http://localhost:3000/health

# Test token endpoint (should return 400 without valid grant)
curl -X POST http://localhost:3000/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token"
```

## Troubleshooting

### Error: "Authentication required"

**Cause**: OAuth flow not completed or token expired
**Fix**: Restart Claude Desktop to trigger re-authorization

### Error: "Unknown client"

**Cause**: Client ID mismatch between server config and Claude Desktop
**Fix**: Ensure `AUTH_CLIENTS` env var includes the `clientId` you're using

### Error: "Redirect URI not allowed"

**Cause**: Redirect URI mismatch
**Fix**: Ensure the `redirectUris` in `AUTH_CLIENTS` matches Claude Desktop's callback URL

### Browser shows "Cannot GET /authorize"

**Cause**: Wrong HTTP method (must be GET or POST with valid params)
**Fix**: Ensure you're accessing through Claude Desktop's OAuth flow, not directly

### Error: "Invalid email or password"

**Cause**: Sleep API rejected credentials
**Fix**: Verify your Sleep account credentials in a browser at https://app.8slp.net/

### CSRF token expired

**Cause**: Took longer than 10 minutes to submit the form
**Fix**: Refresh the page and try again

### Error: "Sleep credentials missing or expired"

**Cause**: Authorization code was consumed but Sleep tokens weren't stored
**Fix**: Check server logs for errors during token exchange. Restart server and try again.

## Testing Multiple Users

The server supports multiple users simultaneously:

1. User A authorizes with their Sleep account → tokens stored under their `subject`
2. User B authorizes with different Sleep account → separate token storage
3. Each tool call retrieves credentials based on the JWT's `subject` claim

To test:
1. Use MCP Inspector with one Sleep account
2. Use Claude Desktop with another Sleep account (if available)
3. Both should work independently

## Security Considerations for Testing

- **Do NOT commit `.env`** with real credentials
- Use development secrets only (rotate before production)
- Test CSRF protection by:
  - Opening authorize page, waiting 11 minutes, submitting → should fail
  - Reusing a CSRF token → should fail
- Test PKCE by:
  - Attempting token exchange without valid code_verifier → should fail

## Next Steps

Once E2E testing succeeds:

1. ✅ Add integration tests that simulate the OAuth flow
2. ✅ Test token refresh flow (wait for access token to expire)
3. ✅ Test concurrent requests from same user
4. ✅ Test error handling (network failures, invalid tokens, etc.)
5. ✅ Deploy to production with proper secrets rotation

## Architecture Diagram

```
┌─────────────────┐
│ Claude Desktop  │
│  (MCP Client)   │
└────────┬────────┘
         │ 1. Connect to MCP endpoint
         │ 2. Trigger OAuth flow
         ▼
┌─────────────────────────────┐
│   Your MCP Server           │
│   (localhost:3000)          │
│                             │
│  ┌──────────────────────┐   │
│  │ /mcp (MCP Protocol)  │   │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ /authorize (OAuth)   │◄──┼──3. User redirected here
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ /token (OAuth)       │   │
│  └──────────┬───────────┘   │
└─────────────┼───────────────┘
              │ 4. Authenticate with Sleep
              ▼
      ┌──────────────────┐
      │   Sleep API      │
      │ (auth-api.8slp.net)│
      └──────────────────┘
```

## Example Complete Flow Trace

```
1. Claude Desktop → GET http://localhost:3000/authorize?response_type=code&client_id=claude-desktop&...
2. Server → 200 OK (HTML login form with CSRF token)
3. User → POST http://localhost:3000/authorize (email, password, csrf_token)
4. Server → Call Sleep API: POST https://auth-api.8slp.net/v1/tokens
5. Sleep API → 200 OK (Sleep access_token + refresh_token)
6. Server → Store encrypted credentials in memory
7. Server → Generate OAuth authorization code
8. Server → 302 Redirect to callback with code
9. Claude Desktop → POST http://localhost:3000/token (code, code_verifier)
10. Server → Validate code, retrieve Sleep credentials
11. Server → Issue OAuth access_token + refresh_token
12. Server → 200 OK (token response)
13. Claude Desktop → Stores tokens, connects to /mcp with Bearer token
14. User asks → "Get my sleep data"
15. Claude Desktop → POST http://localhost:3000/mcp (tool call with Bearer token)
16. Server → Verify token, extract subject
17. Server → Retrieve Sleep credentials from storage
18. Server → Call Sleep API with stored credentials
19. Server → 200 OK (tool result)
20. Claude Desktop → Display results to user
```
