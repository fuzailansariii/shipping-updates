export type Message = {
  id: string;
  customer: string;
  subject: string | null;
  message: string;
  time: string;
  unread?: boolean;
};
