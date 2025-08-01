/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_PUMP_PROGRAM_ID:
      process.env.NEXT_PUBLIC_PUMP_PROGRAM_ID || 'C1NYLjRoFHPvBASeiWsFqFmWFcoFwzPYGKHCAiU86HAd',
  },
};

export default nextConfig;
