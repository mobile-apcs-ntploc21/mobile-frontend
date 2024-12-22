import { Premium, PremiumDuration } from '@/types/premium';

export const samplePremiums: Premium[] = [
  {
    duration: PremiumDuration.MONTHLY,
    price: 25_000,
    currency: 'VND',
    features: ['Images are uploaded with full HD.']
  },
  {
    duration: PremiumDuration.THREE_MONTHS,
    price: 60_000,
    currency: 'VND',
    discount: 0.2,
    features: ['Images are uploaded with full HD.', 'Upload files up to 50MB.']
  },
  {
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
