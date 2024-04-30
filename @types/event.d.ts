type CreateEvent = {
  name: string;
  editable: boolean;
  notificationType: string;
};

type UpdateEvent = {
  id: string;
  name: string;
  editable: boolean;
  notificationType: string;
};

type EventResponse = {
  id: string;
  name: string;
  editable: boolean;
  notificationType: string;
};
