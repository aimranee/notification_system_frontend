type CreateClientApp = {
  name: string;
  clientId: string;
  enabled: boolean;
};

type ClientAppResponse = {
  id: string;
  createdDate: string;
  modifiedDate: string;
  name: string;
  clientId: string;
  enabled: boolean;
  clientKyecloakId: number;
  clientSecret: string;
};
