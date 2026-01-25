export interface WhatsappSession {
  session: string;
  me?: {
    id: string;
    pushName: string;
  };
  payload?: {
    status: string;
    statuses?: {
      status: string;
      timestamp: number;
    }[];
  };
}
