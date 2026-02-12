# MCP Service (Python)

Custom Model Context Protocol server.

**Registry:** `services/services.json` → `id: mcp-service`  
**Tags:** mcp, protocol, tools, claude, cursor, v0, context, agent

## Language: Python 3.12+
## Framework: FastAPI + MCP SDK
## Location: services/python/mcp-service/

## What This Does
- Exposes tools via MCP protocol (search, code, file access)
- Can connect to Claude Desktop, Cursor, v0
- Contains YOUR tool implementations and business logic

## Structure
```
mcp-service/
  app/
    main.py          # MCP server entry
    tools/           # Tool implementations
  requirements.txt
  Dockerfile
```
