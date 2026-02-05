export interface ReferralInfo {
  referralLink: string;
  stats: ReferralStats;
}

export interface ReferralStats {
  clicks: number;
  purchases: number;
  income: number;
  currency: string;
}

export interface Referral {
  id: string;
  inviterId: string;
  invitedUserId: string;
  createdAt: string;
}
