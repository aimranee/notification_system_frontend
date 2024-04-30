type CreateTemplate = {
  description?: string;
  message?: string;
  subject?: string;
  emailMarkup?: string;
  emailRenderedHtml?: string;
  event?: EventResponse;
  emailProvider?: object;
  // active?: boolean;
  // title?: string;
  // link?: string;
  // file?: string;
  language?: string;
};

type UpdateTemplate = CreateTemplate & {
  id: string;
};

type TemplateResponse = {
  id: string;
  CreatedDate: string;
  UpdatedDate: string;
  notificationType: string;
  description?: string;
  message?: string;
  subject?: string;
  markup?: string;
  emailRenderedHtml?: string;
  eventName: string;
  emailProviderName: string;
  // active?: boolean;
  // title?: string;
  // link?: string;
  // file?: string;
  language?: string;
};
