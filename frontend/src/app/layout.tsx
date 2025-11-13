import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'block', // Immediately show text with fallback font (better LCP)
  adjustFontFallback: true, // Fallback font metriklerini ayarla
  preload: true, // Font'u önceden yükle
  weight: ['400', '700'], // Only load needed weights
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Font yüklenirken CLS'yi önler
  adjustFontFallback: true, // Fallback font metriklerini ayarla
  preload: true, // Font'u önceden yükle
});

export const metadata: Metadata = {
  title: "EduExcellence - Erasmus Eğitim Programları",
  description: "Uluslararası eğitim fırsatları ile kariyerinizi bir üst seviyeye taşıyın. KA1, KA2 ve KA3 programları ile Avrupa'da eğitim alın.",
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
    shortcut: '/images/logo.jpg',
  },
  openGraph: {
    title: "EduExcellence - Erasmus Eğitim Programları",
    description: "Uluslararası eğitim fırsatları ile kariyerinizi bir üst seviyeye taşıyın. KA1, KA2 ve KA3 programları ile Avrupa'da eğitim alın.",
    url: 'https://edu-excellence.net',
    siteName: 'EduExcellence',
    images: [
      {
        url: 'https://edu-excellence.net/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'EduExcellence Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "EduExcellence - Erasmus Eğitim Programları",
    description: "Uluslararası eğitim fırsatları ile kariyerinizi bir üst seviyeye taşıyın. KA1, KA2 ve KA3 programları ile Avrupa'da eğitim alın.",
    images: ['https://edu-excellence.net/images/logo.jpg'],
  },
  metadataBase: new URL('https://edu-excellence.net'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Favicon - Logo kullan */}
        <link rel="icon" type="image/jpeg" href="/images/logo.jpg" />
        <link rel="shortcut icon" type="image/jpeg" href="/images/logo.jpg" />
        <link rel="apple-touch-icon" href="/images/logo.jpg" />
        
        {/* Open Graph Meta Tags - Google Arama Sonuçları için */}
        <meta property="og:image" content="https://edu-excellence.net/images/logo.jpg" />
        <meta property="og:image:secure_url" content="https://edu-excellence.net/images/logo.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="EduExcellence Logo" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:image" content="https://edu-excellence.net/images/logo.jpg" />
        <meta name="twitter:image:alt" content="EduExcellence Logo" />
        
        {/* Site Logo ve Organization için JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "EduExcellence",
              "url": "https://edu-excellence.net",
              "logo": "https://edu-excellence.net/images/logo.jpg",
              "description": "Uluslararası eğitim fırsatları ile kariyerinizi bir üst seviyeye taşıyın. KA1, KA2 ve KA3 programları ile Avrupa'da eğitim alın."
            })
          }}
        />
        
        {/* WebSite Structured Data - Google Sitelinks için */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "EduExcellence",
              "url": "https://edu-excellence.net",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://edu-excellence.net/news?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "url": "https://edu-excellence.net"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "About Us",
                    "url": "https://edu-excellence.net/about"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Services",
                    "url": "https://edu-excellence.net/services"
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "KA1 Courses",
                    "url": "https://edu-excellence.net/ka1-courses"
                  },
                  {
                    "@type": "ListItem",
                    "position": 5,
                    "name": "Reviews",
                    "url": "https://edu-excellence.net/reviews"
                  },
                  {
                    "@type": "ListItem",
                    "position": 6,
                    "name": "KA2 Projects",
                    "url": "https://edu-excellence.net/ka2-projects"
                  },
                  {
                    "@type": "ListItem",
                    "position": 7,
                    "name": "News",
                    "url": "https://edu-excellence.net/news"
                  },
                  {
                    "@type": "ListItem",
                    "position": 8,
                    "name": "Contact",
                    "url": "https://edu-excellence.net/contact"
                  }
                ]
              }
            })
          }}
        />
        
        {/* Preconnect to API */}
        <link rel="preconnect" href="https://edu-excellence.net" />
        <link rel="dns-prefetch" href="https://edu-excellence.net" />
        
        {/* Optimize resource loading */}
        <link rel="preload" as="style" href="/_next/static/css/app/layout.css" />
        
        {/* Reduce font flash */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'GeistFallback';
              src: local('Arial');
              ascent-override: 95%;
              descent-override: 25%;
              line-gap-override: 0%;
              size-adjust: 107%;
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
