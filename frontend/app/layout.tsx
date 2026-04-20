
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaya Janardhana - Sacred Goods Storefront",
  description: "Heritage Community Marketplace for Sacred Distribution",
  icons: { icon: '/favicon.svg' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#1A0303', color: '#E6D5B8', fontFamily: "'Playfair Display', serif" }}>
        {children}
      </body>
    </html>
  );
}
