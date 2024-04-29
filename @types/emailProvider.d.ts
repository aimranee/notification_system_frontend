type CreateEmailProvider = {
  name: string;
  mailProtocol: string;
  smtpAuth: boolean;
  starttlsEnable: boolean;
  sslTrust: string;
  mailHost: string;
  mailPort: string;
  mailUsername: string;
  mailPassword: string;
};

type EmailProviderResponse = {
  id: string;
  name: string;
  mailHost: string;
  mailPort: string;
  mailUsername: string;
  mailPassword: string;
  mailProtocol: string;
  smtpAuth: boolean;
  starttlsEnable: boolean;
  sslTrust: string;
};
