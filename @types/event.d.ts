type CreateEvent = {
  eventName: string;
  editable: boolean;
  notificationType: string;
  description?: string;
  message?: string;
  subject?: string;
  emailMarkup?: string;
  emailRenderedHtml?: string;
  emailProvider?: object;
  language?: string;
  variables?: string;
  clientAppId?: string;
};

type UpdateEvent = CreateEvent & {
  id: string;
  eventName: string;
  editable: boolean;
  notificationType: string;
};

type EventResponse = {
  id: string;
  eventName: string;
  editable: boolean;
  notificationType: string;
  CreatedDate: string;
  UpdatedDate: string;
  description: string;
  message: string;
  subject: string;
  markup: string;
  emailRenderedHtml: string;
  emailProviderName: string;
  variables: string;
  language: string;
  clientAppId: string;
};

type EventsNameResponse = {
  id: string;
  eventName: string;
  description: string;
  editable: boolean;
};
