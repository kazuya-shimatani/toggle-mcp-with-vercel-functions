import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { TogglTrackClient } from "../lib/toggle-track";

const handler = initializeMcpApiHandler(
  (server) => {
    server.tool("getTimeEntries", { 
      togglApiToken: z.string(),
      startDate: z.string(),
      endDate: z.string()
    }, async ({ togglApiToken, startDate, endDate }) => {
      if (!togglApiToken) {
        throw new Error("Unauthorized: Invalid Toggle API key");
      }
      const togglTrackClient = new TogglTrackClient(togglApiToken);
      const data = await togglTrackClient.getTotalMonthlyDuration(startDate, endDate);
      return {
        content: [{ type: "text", text: `Result: ${JSON.stringify(data)}` }],
      };
    });
  },
  {
    capabilities: {
      tools: {
        getTimeEntries: {
          description: "Get span time entries",
        },
      },
    },
  }
);

export default handler;
