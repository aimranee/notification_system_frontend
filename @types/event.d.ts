type CreateEvent = {
  name: string;
  editable: boolean;
};

type UpdateEvent = {
  id: string;
  name: string;
  editable: boolean;
};

type EventResponse = {
  id: string;
  name: string;
  editable: boolean;
};
