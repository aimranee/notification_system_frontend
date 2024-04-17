type CreateProvider = {
  provider_name: string;
  code: string;
  encrypted: string;
  value: string;   
};

type ProviderResponse = {
  id: string;
  Created_date: string;
  modified_date: string;
  provider_name: string;
  code: string;
  encrypted: string;
  value: string;
};

type SmtpConfig = {
  smtp_host: string;
  smtp_port: number;
  smtp_user_name: string;
  smtp_password: string;
  sender: string;
};
