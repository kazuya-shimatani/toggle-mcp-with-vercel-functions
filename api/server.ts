import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { TogglTrackClient } from "../lib/toggle-track";

const TOGGL_TRACK_API_TOKEN = process.env.TOGGL_TRACK_API_TOKEN;

if (!TOGGL_TRACK_API_TOKEN) {
  throw new Error("TOGGL_TRACK_API_TOKEN is not set");
}

const togglTrackClient = new TogglTrackClient(TOGGL_TRACK_API_TOKEN);

const handler = initializeMcpApiHandler(
  (server) => {
    // Add more tools, resources, and prompts here
    // server.tool("echo", { message: z.string() }, async ({ message }) => ({
    //   content: [{ type: "text", text: `Tool echo: ${message}` }],
    // }));

    server.tool("getTimeEntries", { 
      startDate: z.string(),  // 日付型のパラメータ
      endDate: z.string()   // 日付型のパラメータ
    }, async ({ startDate, endDate }) => {
      const data = await togglTrackClient.getTotalMonthlyDuration(startDate, endDate);
      return {
        content: [{ type: "text", text: `Result: ${JSON.stringify(data)}` }],
      };
    });
  },
  {
    capabilities: {
      tools: {
        // echo: {
        //   description: "Echo a message",
        // },
        getTimeEntries: {
          description: "Get span time entries",
        },
      },
    },
  }
);

export default handler;
