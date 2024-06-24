export const USER_ROLE = {
  ADMIN: "admin",
  CLIENTAPP: "clientApp",
};

export const ProviderName = {
  TWILIO: "twilio",
  VONAGE: "vonage",
  SMTP: "smtp",
};

export const NotificationType = {
  EMAIL: "email",
  SMS: "sms",
};

export const SMS_Policy = [
  { value: "receiver.country", label: "Receiver Country" },
  { value: "receiver.prefix", label: "Receiver Prefix" },
];
