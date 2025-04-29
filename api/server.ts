import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { TogglTrackClient } from "../lib/toggle-track";
import { VercelRequest, VercelResponse } from '@vercel/node';
import { IncomingMessage, ServerResponse } from 'http';

const TOGGL_TRACK_API_TOKEN = process.env.TOGGL_TRACK_API_TOKEN;

if (!TOGGL_TRACK_API_TOKEN) {
  throw new Error("TOGGL_TRACK_API_TOKEN is not set");
}

const togglTrackClient = new TogglTrackClient(TOGGL_TRACK_API_TOKEN);

const mcpHandler = initializeMcpApiHandler(
  (server) => {
    // Add more tools, resources, and prompts here
    server.tool("echo", { message: z.string() }, async ({ message }) => ({
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    }));

    server.tool("getMonthlyTotalHours", {}, async () => {
      const totalHours = await togglTrackClient.getTotalMonthlyDuration();
      return {
        content: [{ type: "text", text: `今月の合計作業時間: ${totalHours.toFixed(2)}時間` }],
      };
    });
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        getMonthlyTotalHours: {
          description: "今月の合計作業時間を取得します",
        },
      },
    },
  }
);

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    await mcpHandler(req as unknown as IncomingMessage, res as unknown as ServerResponse);
  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
