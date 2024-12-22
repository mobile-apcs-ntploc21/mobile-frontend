export enum PremiumDuration {
  MONTHLY = '1 month',
  THREE_MONTHS = '3 months',
  SIX_MONTHS = '6 months'
}

export type Premium = {
  duration: PremiumDuration;
  price: number;
  features: string[];
};
