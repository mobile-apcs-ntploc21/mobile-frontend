export enum PremiumDuration {
  MONTHLY = '1 month',
  THREE_MONTHS = '3 months',
  SIX_MONTHS = '6 months'
}

export enum PremiumPack {
  MONTHLY = '6766f0d9060df0aa8fbb8afb',
  THREE_MONTHS = '6766f0e9060df0aa8fbb8afe',
  SIX_MONTHS = '6766f0f6060df0aa8fbb8b00'
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
