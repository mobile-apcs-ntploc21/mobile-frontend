export enum PremiumDuration {
  MONTHLY = '1 month',
  THREE_MONTHS = '3 months',
  SIX_MONTHS = '6 months'
}

export enum PremiumPack {
  MONTHLY = 'Monthly',
  THREE_MONTHS = 'Three_Months',
  SIX_MONTHS = 'Six_Months'
}

export type Premium = {
  id: PremiumPack;
  duration: PremiumDuration;
  originalPrice: number;
  price: number;
  features: string[];
  discount?: number;
  currency: string;
};
