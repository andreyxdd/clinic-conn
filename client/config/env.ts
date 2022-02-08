const env = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
  isProduction: process.env.NEXT_PUBLIC_ENVIRONMENT! === 'production',
  api: process.env.NEXT_PUBLIC_API_URL!,
  websocketUrl: process.env.NEXT_PUBLIC_REALTIME_URL!,
  baseDomain: process.env.BASE_DOMAIN!,
};

export default env;
