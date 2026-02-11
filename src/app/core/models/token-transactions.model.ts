export interface CreateTokenOrderResponse {
  url: string;
  paymentId: string;
}

export interface TokenTransaction {
  id: string;
  amount: string;
  referralBonus: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  externalId: string | null;
  createdAt: Date;
  user?: {
    id: string;
    telegramId: string;
    username: string;
    firstName: string;
    lastName: string | null;
    isBlocked: boolean;
    createdAt: Date;
  };
  inviter?: {
    id: string;
    telegramId: string;
    username: string;
    firstName: string;
    lastName: string | null;
    isBlocked: boolean;
    createdAt: Date;
  } | null;
}

export interface TokenPackage {
  tokens: number;
  price: number;
  tag?: 'Популярно' | 'Выгодно';
}
