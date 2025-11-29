import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

export const metadata: Metadata = {
  title: 'Afroz Sheikh – Full-Stack Developer',
  description: 'The interactive terminal portfolio of Afroz Sheikh, a full-stack web developer specializing in React, Next.js, Node.js, and TypeScript.',
  openGraph: {
    title: 'Afroz Sheikh – Full-Stack Developer',
    description: 'The interactive terminal portfolio of Afroz Sheikh.',
    type: 'website',
    url: 'https://afroz-portfolio.dev', // Replace with actual URL
    images: [
      {
        url: 'https://picsum.photos/seed/og-image/1200/630', // Replace with actual OG image
        width: 1200,
        height: 630,
        alt: 'Afroz Sheikh Portfolio Terminal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Afroz Sheikh – Full-Stack Developer',
    description: 'The interactive terminal portfolio of Afroz Sheikh.',
    images: ['https://picsum.photos/seed/og-image/1200/630'], // Replace with actual OG image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-code">
        <div className="scanline" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
