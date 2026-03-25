import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartWatts - Cycling Performance Analytics',
  description: 'AI-powered cycling training analysis with TrainingPeaks metrics and VeloViewer visualizations',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
