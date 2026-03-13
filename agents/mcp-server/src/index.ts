import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TOOLS } from "./tools.js";
import { handleToolCall } from "./handlers.js";

// Create the MCP server instance
const server = new McpServer({
  name: "grinta-cdp",
  version: "0.1.0"
});

/**
 * Register all tools discovered in tools.ts
 * We map the generic TOOLS array to the specialized McpServer tool registration
 */
for (const tool of TOOLS) {
  server.tool(
    tool.name,
    tool.description,
    tool.inputSchema.properties as any,
    async (args: any) => {
      try {
        // Dispatch to our centralized handler logic
        const result = await handleToolCall(tool.name, args ?? {});
        return result;
      } catch (error) {
        console.error(`Error in tool ${tool.name}:`, error);
        throw error;
      }
    }
  );
}

// Start stdio transport for the MCP protocol
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // We use error stream for logs to keep stdout clean for JSON-RPC
  console.error("Grinta MCP server running on stdio.");
}

main().catch((e: Error) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
