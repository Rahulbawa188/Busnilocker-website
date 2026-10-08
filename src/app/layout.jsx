import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'Ohana Busnilocker | Business Passport & Document Vault',
  description: 'Enterprise Business Passport, Document Vault, Verification, and Compliance Management System',
  icons: {
    icon: '/assets/logo-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/assets/logo-icon.png" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {children}
        <Script src="/assets/html2pdf.bundle.min.js" strategy="beforeInteractive" />
        <Script src="/assets/app.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
