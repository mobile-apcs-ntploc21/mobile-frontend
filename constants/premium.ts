import { Premium, PremiumDuration, PremiumPack } from '@/types/premium';

export const samplePremiums: Premium[] = [
  {
    id: PremiumPack.BASIC,
    duration: PremiumDuration.MONTHLY,
    price: 25_000,
    currency: 'VND',
    features: ['Images are uploaded with full HD.']
  },
  {
    id: PremiumPack.STANDARD,
    duration: PremiumDuration.THREE_MONTHS,
    price: 60_000,
    currency: 'VND',
    discount: 0.2,
    features: ['Images are uploaded with full HD.', 'Upload files up to 50MB.']
  },
  {
    id: PremiumPack.DELUXE,
    duration: PremiumDuration.SIX_MONTHS,
    price: 180_000,
    currency: 'VND',
    discount: 0.4,
    features: [
      'Images are uploaded with full HD.',
      'Upload files up to 50MB.',
      'Use cross-server emojis.'
    ]
  }
];
