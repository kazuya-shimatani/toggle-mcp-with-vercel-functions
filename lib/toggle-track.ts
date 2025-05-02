import axios from 'axios';

const TOGGL_TRACK_API_BASE_URL = 'https://api.track.toggl.com/api/v9';

const toUTCISOString = (date: Date) => (new Date(date.getTime() - (9 * 60 * 60 * 1000))).toISOString();

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
    const startDate = toUTCISOString(inputStartDate ? new Date(inputStartDate) : new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59));
    const endDate = toUTCISOString(inputEndDate ? new Date(new Date(inputEndDate).setHours(23, 59, 59, 999)) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));

    console.log(`startDate: ${startDate}`);
    console.log(`endDate: ${endDate}`);

    const response = await axios.get(`${TOGGL_TRACK_API_BASE_URL}/me/time_entries`, {
        headers: this.getAuthHeader(),
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

    return response.data;
  }
} 