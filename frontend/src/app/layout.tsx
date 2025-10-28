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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
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
