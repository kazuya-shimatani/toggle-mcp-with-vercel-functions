import axios from 'axios';
import moment from 'moment';

const TOGGL_TRACK_API_BASE_URL = 'https://api.track.toggl.com/api/v9';

export class TogglTrackClient {
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  private getAuthHeader() {
    return {
      Authorization: `Basic ${Buffer.from(`${this.apiToken}:api_token`).toString('base64')}`,
    };
  }

  async getMonthlyTimeEntries() {
    const startOfMonth = moment().startOf('month').toISOString();
    const endOfMonth = moment().endOf('month').toISOString();

    const response = await axios.get(`${TOGGL_TRACK_API_BASE_URL}/me/time_entries`, {
      headers: this.getAuthHeader(),
      params: {
        start_date: startOfMonth,
        end_date: endOfMonth,
      },
    });

    return response.data;
  }

  async getTotalMonthlyDuration() {
    const timeEntries = await this.getMonthlyTimeEntries();
    const totalDuration = timeEntries.reduce((sum: number, entry: any) => {
      return sum + (entry.duration || 0);
    }, 0);

    // Convert seconds to hours
    return totalDuration / 3600;
  }
} 