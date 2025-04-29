import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const origin = "https://toggle-mcp-with-vercel-functions.vercel.app";

async function main() {
  const transport = new SSEClientTransport(new URL(`${origin}/api/sse`));

  const client = new Client(
    {
      name: "monthly-hours-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {},
      },
    }
  );

  await client.connect(transport);

  console.log("Connected to MCP server");

  const result = await client.invokeTool("getMonthlyTotalHours", {});
  console.log(result.content[0].text);
}

main().catch(console.error); 