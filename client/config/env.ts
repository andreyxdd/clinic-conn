const env = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
  isProduction: process.env.NEXT_PUBLIC_ENVIRONMENT! === 'production',
  api: `${process.env.NEXT_PUBLIC_SERVER_URL!}/api`,
  socket: process.env.NEXT_PUBLIC_SERVER_URL!,
  websocketUrl: process.env.NEXT_PUBLIC_REALTIME_URL!,
  baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN!,
  ytApiKey: process.env.NEXT_PUBLIC_YT_API_KEY!,
};

export default env;
