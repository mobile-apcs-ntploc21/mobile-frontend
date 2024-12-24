export enum PremiumDuration {
  MONTHLY = '1 month',
  THREE_MONTHS = '3 months',
  SIX_MONTHS = '6 months'
}

export enum PremiumPack {
  BASIC = 'Basic',
  STANDARD = 'Standard',
  DELUXE = 'Deluxe'
}

export type Premium = {
  id: PremiumPack;
  duration: PremiumDuration;
  price: number;
  features: string[];
  discount?: number;
  currency: string;
};
