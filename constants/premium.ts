import { Premium, PremiumDuration, PremiumPack } from '@/types/premium';

export const samplePremiums: Premium[] = [
  {
    id: PremiumPack.MONTHLY,
    duration: PremiumDuration.MONTHLY,
    originalPrice: 25_000,
    price: 25_000,
    currency: 'VND',
    features: [
      'Images are uploaded with full HD.',
      'Upload files up to 50MB.',
      'Use cross-server emojis.'
    ]
  },
  {
    id: PremiumPack.THREE_MONTHS,
    duration: PremiumDuration.THREE_MONTHS,
    originalPrice: 75_000,
    price: 60_000,
    currency: 'VND',
    discount: 0.2,
    features: [
      'Images are uploaded with full HD.',
      'Upload files up to 50MB.',
      'Use cross-server emojis.'
    ]
  },
  {
    id: PremiumPack.SIX_MONTHS,
    duration: PremiumDuration.SIX_MONTHS,
    originalPrice: 300_000,
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
