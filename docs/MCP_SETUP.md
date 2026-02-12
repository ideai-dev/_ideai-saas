# MCP Setup Guide

Complete guide for setting up Model Context Protocol (MCP) servers with Claude Desktop, Cursor, and other AI tools.

## What is MCP?

Model Context Protocol (MCP) is an open standard for connecting AI assistants to external data sources and tools. It allows your AI tools to:

- Access your codebase and project files
- Execute commands and scripts
- Query databases and APIs
- Use third-party services (GitHub, Slack, Vercel, etc.)

## Available MCP Configurations

This monorepo includes pre-configured MCP servers in `/providers/mcp/`:

### 1. **claude-desktop.json** - Full Stack Development
Custom MCP server for your monorepo with tools for:
- Database queries (PostgreSQL + pgvector)
- Vector search (Pinecone, Qdrant)
- LLM operations (OpenAI, Anthropic)
- File system operations
- Python script execution

### 2. **v0.json** - v0 AI Code Generation
Vercel's AI-powered component generator:
- Generate React components
- Refine existing code
- Access v0 templates
- shadcn/ui integration

### 3. **shadcn.json** - Component Management
shadcn/ui CLI integration:
- Add components to your project
- List available components
- Update existing components
- Browse themes

### 4. **vercel.json** - Deployment & Platform
Vercel platform management:
- Deploy projects
- Manage environment variables
- View deployment logs
- Access project settings

## Setup Instructions

### For Claude Desktop

1. **Locate your Claude config file:**
   ```bash
   # macOS
   ~/Library/Application Support/Claude/claude_desktop_config.json
   
   # Windows
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. **Merge configurations:**
   ```bash
   # Copy our pre-configured MCP servers
   cat providers/mcp/claude-desktop.json >> ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

3. **Add your API keys to the config:**
   ```json
   {
     "mcpServers": {
       "monorepo": {
         "env": {
           "DATABASE_URL": "your-postgres-url",
           "OPENAI_API_KEY": "your-key",
           "ANTHROPIC_API_KEY": "your-key"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### For Cursor IDE

1. **Open Cursor Settings** (Cmd/Ctrl + ,)

2. **Navigate to:** Extensions → MCP

3. **Add MCP servers:**
   ```json
   {
     "mcpServers": {
       "v0": {
         "command": "npx",
         "args": ["-y", "@vercel/mcp-v0"],
         "env": {
           "V0_API_KEY": "your-v0-api-key"
         }
       },
       "shadcn": {
         "command": "npx",
         "args": ["shadcn-ui"]
       }
     }
   }
   ```

4. **Reload Cursor**

### For Custom Applications

Use the MCP service in your own applications:

```typescript
import { MCPClient } from '@modelcontextprotocol/sdk'

const client = new MCPClient({
  serverPath: '/vercel/share/v0-project/services/mcp-service',
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
})

// Use MCP tools
const result = await client.callTool('query_database', {
  query: 'SELECT * FROM users LIMIT 10'
})
```

## Testing Your MCP Setup

### 1. Test Claude Desktop Integration

Open Claude Desktop and try:

```
Can you query the users table and show me the latest 5 users?
```

```
Generate a React button component using v0
```

### 2. Test Cursor Integration

In Cursor, use Cmd+K and ask:

```
Add the shadcn dialog component to my project
```

```
Deploy this project to Vercel
```

## MCP Tool Reference

### Custom Monorepo Server

**Available Tools:**
- `query_database` - Execute SQL queries
- `vector_search` - Search embeddings
- `generate_text` - LLM text generation
- `execute_python` - Run Python scripts
- `read_file` - Read project files
- `write_file` - Write to project files

### v0 Server

**Available Tools:**
- `generate_component` - Create React components
- `refine_code` - Improve existing code

### shadcn Server

**Available Tools:**
- `add_component` - Add UI components
- `list_components` - Browse available components
- `update_components` - Update existing components

### Vercel Server

**Available Tools:**
- `deploy` - Deploy to Vercel
- `get_deployments` - List deployments
- `get_env_vars` - View environment variables
- `set_env_var` - Update environment variables

## Environment Variables

Create a `.env.local` file in the root with all required keys:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...

# Vector Databases
PINECONE_API_KEY=...
QDRANT_URL=https://...

# Vercel
VERCEL_TOKEN=...
VERCEL_TEAM_ID=...

# v0
V0_API_KEY=...

# Integrations
GITHUB_TOKEN=ghp_...
SLACK_TOKEN=xoxb-...
```

## Troubleshooting

### MCP Server Not Found

**Problem:** Claude/Cursor can't find your MCP server

**Solution:**
1. Check the command path is correct
2. Ensure Node.js/Python is in your PATH
3. Try running the command manually first

### Authentication Errors

**Problem:** MCP tools fail with auth errors

**Solution:**
1. Verify all API keys in your config
2. Check environment variables are set
3. Ensure tokens haven't expired

### Tool Execution Fails

**Problem:** MCP tools return errors

**Solution:**
1. Check the tool's input schema matches your request
2. Verify database connections are working
3. Look at MCP server logs for details

## Advanced Configuration

### Custom MCP Server

Create your own MCP server for team-specific tools:

```typescript
// services/custom-mcp/src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server'

const server = new Server({
  name: 'custom-tools',
  version: '1.0.0'
})

server.registerTool({
  name: 'custom_tool',
  description: 'My custom tool',
  inputSchema: {
    type: 'object',
    properties: {
      input: { type: 'string' }
    }
  },
  handler: async (input) => {
    // Your custom logic
    return { result: 'success' }
  }
})

server.start()
```

### Add to Claude Desktop:

```json
{
  "mcpServers": {
    "custom": {
      "command": "node",
      "args": ["services/custom-mcp/dist/index.js"]
    }
  }
}
```

## Next Steps

1. ✅ Install MCP configs in Claude Desktop
2. ✅ Test each tool with simple queries
3. ✅ Add your API keys to environment
4. ✅ Create custom tools for your workflow
5. ✅ Share MCP configs with your team

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude Desktop Guide](https://claude.ai/desktop)
- [v0 MCP Server](https://github.com/vercel/mcp-v0)
- [Cursor MCP Setup](https://cursor.sh/mcp)
