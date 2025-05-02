# Run an MCP Server on Vercel

## Usage

This MCP server exposes a tool called `getTimeEntries` for retrieving Toggl time entries for a specified period.

### Tool: getTimeEntries

**Parameters:**
- `togglApiToken` (string, required): Your Toggl API token
- `startDate` (string, required): Start date in `YYYY-MM-DD` format
- `endDate` (string, required): End date in `YYYY-MM-DD` format

**Example request:**
```json
{
  "method": "getTimeEntries",
  "params": {
    "togglApiToken": "your_toggl_api_token",
    "startDate": "2025-04-01",
    "endDate": "2025-04-30"
  }
}
```


