export interface User {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  isBlocked: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  user?: User;
}
