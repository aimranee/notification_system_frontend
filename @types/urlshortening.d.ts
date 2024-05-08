type UrlshorteningResponse = {
  id: string;
  originalUrl: string;
  shortLink: string;
  createdDate: LocalDateTime;
  expirationDate: LocalDateTime;
};
