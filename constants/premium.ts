import { Premium, PremiumDuration } from '@/types/premium';

export const samplePremiums: Premium[] = [
  {
    duration: PremiumDuration.MONTHLY,
    price: 25_000,
    features: [
      'Images are uploaded with full HD.',
      'Upload files up to 50MB.',
      'Use cross-server emojis.'
    ]
  },
  {
    duration: PremiumDuration.THREE_MONTHS,
    price: 60_000,
    features: [
      'Images are uploaded with full HD.',
      'Upload files up to 50MB.',
      'Use cross-server emojis.'
    ]
  },
  {
    duration: PremiumDuration.SIX_MONTHS,
    price: 180_000,
    features: [
      'Images are uploaded with full HD.',
      'Upload files up to 50MB.',
      'Use cross-server emojis.'
    ]
  }
];
