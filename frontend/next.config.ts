import type { NextConfig } from "next";

function buildCsp(isProd: boolean) {
  // Keep CSP intentionally compatible with Next.js without nonce plumbing.
  // Tighten later by introducing nonces/hashes for inline scripts.

  const siteDomains = isProd
    ? "https://edu-excellence.net https://www.edu-excellence.net"
    : "'self' http://localhost:3000 https://localhost:3000";

  // `frontend/src/config/api.ts` is currently hardcoded to https://localhost:7166
  // so dev CSP must allow it for fetch + image URLs.
  const apiDomains = isProd
    ? "https://edu-excellence.net https://www.edu-excellence.net"
    : "https://localhost:7166 http://localhost:7166";

  const imageDomains = isProd
    ? `${siteDomains} https://images.unsplash.com https://via.placeholder.com https://picsum.photos`
    : `${siteDomains} ${apiDomains} https://images.unsplash.com https://via.placeholder.com https://picsum.photos`;

  const directives: string[] = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",

    // Next.js needs inline scripts/styles unless you implement nonces.
    // Dev needs 'unsafe-eval' for tooling (HMR/source maps).
    isProd
      ? `script-src 'self' 'unsafe-inline' ${siteDomains}`
      : `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${siteDomains}`,

    // Allow Google Fonts (if used).
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

    // Images: whitelist only trusted domains
    `img-src 'self' data: blob: ${imageDomains}`,
    "font-src 'self' data: https://fonts.gstatic.com",

    // API calls: whitelist approach
    isProd
      ? `connect-src 'self' ${apiDomains}`
      : `connect-src 'self' ${apiDomains} ws://localhost:* wss://localhost:* ws://127.0.0.1:* wss://127.0.0.1:*`,

    // Embeds used in the app (Google Maps + YouTube).
    // Use wildcards for Google subdomains used by Maps embeds (avoids production-only blocks).
    "frame-src 'self' https://*.google.com https://*.youtube.com https://youtube.com",

    // Disallow mixed content in production
    ...(isProd ? ["upgrade-insecure-requests"] : []),
  ];

  return directives.join("; ");
}

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  
  // Security headers
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    const csp = buildCsp(isProd);

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          ...(isProd
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },
              ]
            : []),
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: csp
          }
        ],
      },
    ];
  },
  
  // Optimize production builds - Remove all console logs for security
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  
  // eslint config kaldırıldı - Next.js 16.0.10'da artık desteklenmiyor
  // ESLint artık ayrı komut olarak çalışıyor: npm run lint veya next lint
  
  typescript: {
    // Production build sırasında TypeScript hatalarını ignore et
    ignoreBuildErrors: true,
  },
  images: {
    // Image optimization için
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: (() => {
      const isProd = process.env.NODE_ENV === "production";

      const base = [
        {
          protocol: "https" as const,
          hostname: "edu-excellence.net",
          pathname: "/**",
        },
        {
          protocol: "https" as const,
          hostname: "www.edu-excellence.net",
          pathname: "/**",
        },
        {
          protocol: "https" as const,
          hostname: "images.unsplash.com",
          pathname: "/**",
        },
        {
          protocol: "https" as const,
          hostname: "via.placeholder.com",
          pathname: "/**",
        },
        {
          protocol: "https" as const,
          hostname: "picsum.photos",
          pathname: "/**",
        },
      ];

      if (isProd) return base;

      // Development: allow backend-hosted uploads (api.ts uses https://localhost:7166)
      return [
        {
          protocol: "https" as const,
          hostname: "localhost",
          port: "7166",
          pathname: "/uploads/**",
        },
        ...base,
      ];
    })(),
  },
};

export default nextConfig;
