const config = {
  env: import.meta.env.VITE_ENV || "development",
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  cacheStaleTimeSeconds: parseInt(
    import.meta.env.VITE_CACHE_STALE_TIME_SECONDS || "60",
    10
  ),
} as const;

export default config;
