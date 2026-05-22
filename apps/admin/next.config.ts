import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@nightr/types', '@nightr/supabase'],
};

export default nextConfig;
