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
  // active?: boolean;
  // title?: string;
  // link?: string;
  // file?: string;
  language?: string;
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
  description?: string;
  message?: string;
  subject?: string;
  markup?: string;
  emailRenderedHtml?: string;
  emailProviderName: string;
  // active?: boolean;
  // title?: string;
  // link?: string;
  // file?: string;
  language?: string;
};
