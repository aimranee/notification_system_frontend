type CreatePreferences = {
  recipientEmail: string;
  eventNames: string[];
};

type PreferencesResponse = {
  recipientEmail: string;
  eventName: string;
};
