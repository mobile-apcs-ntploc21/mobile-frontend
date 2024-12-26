interface IConfig {
  API_URL: string;
  PLAYGROUND_MODE: boolean;
  SUBSCRIPTION_URL: string;
  VNPAY_TMN_CODE: string;
}

const config: IConfig = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/graphql',
  PLAYGROUND_MODE: process.env.EXPO_PUBLIC_PLAYGROUND_MODE === 'true',
  SUBSCRIPTION_URL:
    process.env.EXPO_PUBLIC_SUBSCRIPTION_URL ||
    'http://localhost:4000/subscriptions',
  VNPAY_TMN_CODE: process.env.EXPO_PUBLIC_VNPAY_TMN_CODE || '7725KJYQ'
};

export default config;
