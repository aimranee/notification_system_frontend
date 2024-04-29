export const USER_ROLE = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  DEVELOPER: "dev",
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
