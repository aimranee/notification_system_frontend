import axios from "axios";

class PreferencesServeces {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = `${process.env.API_BASE_URL}/notification-service/api/preferences`;
  }

  async createPreferences(
    preferences: CreatePreferences
  ): Promise<PreferencesResponse[]> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/saveAll`,
        preferences
      );
      return response.data;
    } catch (error) {
      console.error("Error preferences", error);
      throw error;
    }
  }

  async findPreferencesByRecipientEmail(
    recipientEmail: string
  ): Promise<PreferencesResponse[]> {
    try {
      const response = await axios.get<PreferencesResponse[]>(
        `${this.apiBaseUrl}/find/byRecipientEmail`,
        {
          params: { recipientEmail },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching preferences for recipient email: ${recipientEmail}`,
        error
      );
      throw error;
    }
  }

  async findPreferencesByToken(
    token: string
  ): Promise<PreferenceTokenResponse> {
    try {
      const response = await axios.get<PreferenceTokenResponse>(
        `${this.apiBaseUrl}/find/byToken`,
        {
          params: { token },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching preferences for token: ${token}`, error);
      throw error;
    }
  }
}

export default PreferencesServeces;
