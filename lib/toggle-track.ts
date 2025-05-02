import axios from 'axios';

const TOGGL_TRACK_API_BASE_URL = 'https://api.track.toggl.com/api/v9';

// JSTの1日をカバーするUTC範囲を返す
const toJSTDayRangeUTC = (dateStr: string) => {
  // JST 00:00:00
  const startJST = new Date(`${dateStr}T00:00:00+09:00`);
  // JST 23:59:59
  const endJST = new Date(`${dateStr}T23:59:59+09:00`);
  return {
    startUTC: startJST.toISOString(),
    endUTC: endJST.toISOString(),
  };
};

export class TogglTrackClient {
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  private getAuthHeader() {
    return {
      'Content-Type': "application/json",
      Authorization: `Basic ${Buffer.from(`${this.apiToken}:api_token`).toString('base64')}`,
    };
  }

  async getTotalMonthlyDuration(inputStartDate?: string, inputEndDate?: string) {
    const now = new Date();
    const start = inputStartDate ? inputStartDate : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const end = inputEndDate ? inputEndDate : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}`;

    const { startUTC } = toJSTDayRangeUTC(start);
    const { endUTC: endOfEndUTC } = toJSTDayRangeUTC(end);

    console.log(`startDate: ${startUTC}`);
    console.log(`endDate: ${endOfEndUTC}`);

    const response = await axios.get(`${TOGGL_TRACK_API_BASE_URL}/me/time_entries`, {
      headers: this.getAuthHeader(),
      params: {
        start_date: startUTC,
        end_date: endOfEndUTC,
      },
    });

    return response.data;
  }
} 